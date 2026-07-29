import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Unit } from '../types'
import { unitsData as staticUnitsData } from '../data/units'

export const useUnits = () => {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true)
        setError(null)

        // Sempre usar dados estáticos como base (fonte da verdade)
        // Eles contêm todas as unidades, lições, descrições e XP
        let resolvedUnits: Unit[] = JSON.parse(JSON.stringify(staticUnitsData))

        // Tentar buscar progresso do Supabase para mesclar com dados estáticos
        try {
          const { data: unitsData, error: unitsError } = await supabase
            .from('units')
            .select('id, title, description')
            .order('id', { ascending: true })

          if (unitsError) throw unitsError

          if (unitsData && unitsData.length > 0) {
            // Se Supabase retornou unidades, tentar buscar lições marcadas como completas
            const allLessonIds = resolvedUnits.flatMap(u => 
              u.lessons.map(l => l.id.toString())
            )

            // Buscar progresso das lições completas
            const { data: lessonsData, error: lessonsError } = await supabase
              .from('user_lessons')
              .select('lesson_id, completed')
              .in('lesson_id', allLessonIds)

            if (!lessonsError && lessonsData && lessonsData.length > 0) {
              // Criar mapa de lições completas
              const completedMap = new Map<string, boolean>()
              lessonsData.forEach((record: any) => {
                if (record.completed) {
                  completedMap.set(record.lesson_id.toString(), true)
                }
              })

              // Mesclar com dados estáticos
              resolvedUnits = resolvedUnits.map(unit => ({
                ...unit,
                lessons: unit.lessons.map(lesson => ({
                  ...lesson,
                  completed: completedMap.has(lesson.id.toString()) ? true : lesson.completed,
                })),
              }))
            }
          }
        } catch (supabaseErr) {
          // Se Supabase falhar, usar dados estáticos puros (já definidos acima)
          console.warn('Supabase indisponível, usando dados estáticos:', supabaseErr)
        }

        setUnits(resolvedUnits)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar unidades'
        setError(message)
        console.error('Erro ao carregar unidades:', err)
        // Garantir que dados estáticos sempre sejam usados em caso de erro
        setUnits(JSON.parse(JSON.stringify(staticUnitsData)))
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [])

  return { units, loading, error }
}
