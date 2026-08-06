import { createFileRoute } from '@tanstack/react-router'
import { LessonScreen } from '../../components/LessonScreen'
import { useUnits } from '../../hooks/useUnits'

function LessonPage() {
    const { lessonId } = Route.useParams()
    const { unitId } = Route.useSearch()
    const { units, updateLessonProgress } = useUnits()

    const lesson = units
        .find((unit) => String(unit.id) === String(unitId))
        ?.lessons.find((item) => String(item.id) === String(lessonId))

    const questions = lesson?.questions ?? []

    return (
        <LessonScreen
            questions={questions}
            lessonId={lessonId}
            lessonTitle={lesson?.title ?? String(lessonId)}
            lessonXp={lesson?.xp ?? 0}
            unitId={unitId}
            onComplete={(completedLessonTitle, completedUnitId) => {
                updateLessonProgress(completedUnitId, completedLessonTitle, true)
            }}
        />
    )
}

const lessonRoute = createFileRoute('/lessons/$lessonId')({
    component: LessonPage,
    validateSearch: (search: Record<string, unknown>) => ({
        unitId: typeof search.unitId === 'string' ? search.unitId : undefined,
    }),
})

export const Route = lessonRoute
