import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Unit } from '../types'
import { unitsData as staticUnitsData } from '../data/units'
import { useAuth } from '../components/auth/authContexts'
import { useToast } from '../components/ToastProvider'

const normalizeLessonTitle = (title: string) =>
  title.trim().replace(/\s+/g, ' ').toLowerCase()

export const useUnits = () => {
  const { user, refreshProfile, setUserTotalXp } = useAuth()
  const { addToast } = useToast()
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateLessonProgress = async (
    unitId: string | number,
    lessonTitle: string,
    completed: boolean,
  ) => {
    // Determine previous completion state to avoid double-adding XP
    const previousCompleted = (() => {
      const foundUnit = units.find((u) => String(u.id) === String(unitId))
      if (!foundUnit) return false
      const foundLesson = foundUnit.lessons.find((l) => l.title === lessonTitle)
      return Boolean(foundLesson?.completed)
    })()

    // Optimistically update UI
    setUnits((currentUnits) =>
      currentUnits.map((unit) => {
        if (String(unit.id) !== String(unitId)) {
          return unit
        }

        return {
          ...unit,
          lessons: unit.lessons.map((lesson) =>
            lesson.title === lessonTitle
              ? { ...lesson, completed }
              : lesson,
          ),
        }
      }),
    )

    const trimmedLessonTitle = lessonTitle?.trim()

    if (!user?.id || !trimmedLessonTitle) {
      return
    }

    try {
      const { data: lessonMatches, error: lessonError } = await supabase
        .from('lessons')
        .select('id, title')
        .ilike('title', trimmedLessonTitle)
        .limit(1)

      const lessonData = lessonMatches?.find(
        (lesson) => normalizeLessonTitle(lesson.title) === normalizeLessonTitle(trimmedLessonTitle),
      )

      if (lessonError || !lessonData?.id) {
        if (lessonError) {
          console.warn('Não foi possível localizar a lição no Supabase para persistir progresso:', lessonError)
        }
        return
      }

      const { error: progressError } = await supabase
        .from('user_lessons')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonData.id,
            is_completed: completed,
            completed_at: completed ? new Date().toISOString() : null,
          },
          { onConflict: 'user_id, lesson_id' },
        )

      if (progressError) {
        console.error('Erro ao persistir progresso da lição no Supabase:', progressError)
        return
      }

      // If we're just now marking it completed (was not completed before), add XP
      if (completed && !previousCompleted) {
        // Find the XP value in the static data by matching normalized title
        const xpToAdd = (() => {
          for (const u of staticUnitsData) {
            for (const l of u.lessons) {
              if (normalizeLessonTitle(l.title) === normalizeLessonTitle(trimmedLessonTitle)) {
                return l.xp ?? 0
              }
            }
          }
          return 0
        })()

        if (xpToAdd > 0) {
          try {
            const { data: profileData, error: profileFetchError } = await supabase
              .from('user_profiles')
              .select('total_xp')
              .eq('id', user.id)
              .maybeSingle()

            if (profileFetchError) {
              console.warn('Falha ao buscar total_xp atual do usuário:', profileFetchError)
            }

            const currentXp = Number(profileData?.total_xp ?? 0)
            const newTotal = currentXp + xpToAdd

            const { error: updateError } = await supabase
              .from('user_profiles')
              .update({ total_xp: newTotal })
              .eq('id', user.id)

            if (updateError) {
              console.error('Falha ao atualizar total_xp do usuário:', updateError)
            } else {
              // optimistically update local user so header shows new XP immediately
              try {
                setUserTotalXp(newTotal)
                // eslint-disable-next-line no-console
                console.debug('[useUnits] setUserTotalXp called', { userId: user.id, newTotal, xpToAdd })
              } catch (err) {
                console.warn('Falha ao setar total_xp localmente:', err)
              }

              // also attempt to refresh profile to keep in sync
              try {
                await refreshProfile()
              } catch (err) {
                console.warn('Falha ao forçar refresh do perfil após atualizar XP:', err)
              }

              // show a toast informing the user about gained XP
              try {
                addToast(`+${xpToAdd} XP`, 'success', 3000)
              } catch (err) {
                console.warn('Falha ao disparar toast de XP:', err)
              }
            }
          } catch (err) {
            console.error('Erro ao incrementar XP do usuário:', err)
          }
        }
      }
    } catch (err) {
      console.error('Erro inesperado ao persistir progresso da lição:', err)
    }
  }

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true)
        setError(null)

        // Sempre usar dados estáticos como base (fonte da verdade)
        const resolvedUnits: Unit[] = JSON.parse(JSON.stringify(staticUnitsData))

        // Só buscar progresso do Supabase se o usuário estiver autenticado
        if (user?.id) {
          try {
            // Buscar lições concluídas pelo usuário no Supabase
            const { data: userLessonsData, error: userLessonsError } = await supabase
              .from('user_lessons')
              .select(`
                is_completed,
                lesson_id,
                lessons!inner (
                  title
                )
              `)
              .eq('user_id', user.id)
              .eq('is_completed', true)

            if (!userLessonsError && userLessonsData && userLessonsData.length > 0) {
              // Extrair os títulos das lições concluídas
              const completedLessonTitles = new Set<string>()
              userLessonsData.forEach((record: any) => {
                const title = record.lessons?.title
                if (title) {
                  completedLessonTitles.add(title)
                }
              })

              // Mesclar com dados estáticos - marcar como completed se estiver no Set
              const mergedUnits = resolvedUnits.map(unit => ({
                ...unit,
                lessons: unit.lessons.map(lesson => ({
                  ...lesson,
                  completed: completedLessonTitles.has(lesson.title) ? true : lesson.completed,
                })),
              }))

              setUnits(mergedUnits)
              return
            }
          } catch (supabaseErr) {
            console.warn('Erro ao buscar progresso do Supabase, usando dados estáticos:', supabaseErr)
          }
        }

        // Fallback: usar dados estáticos sem modificações
        setUnits(resolvedUnits)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar unidades'
        setError(message)
        console.error('Erro ao carregar unidades:', err)
        setUnits(JSON.parse(JSON.stringify(staticUnitsData)))
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [user?.id])

  return { units, loading, error, updateLessonProgress }
}
