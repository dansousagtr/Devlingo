import { createFileRoute } from '@tanstack/react-router'
import {LessonScreen} from '../../components/LessonScreen'
import { lessonsQuestions } from '../../data/questions'

function LessonPage() {
    const { lessonId } = Route.useParams()

    // Buscar as questões para a lição específica
    const questions = lessonsQuestions[lessonId as string] || []

    return <LessonScreen questions={questions} />
}

const lessonRoute = createFileRoute('/lessons/$lessonId')({
    component: LessonPage,
})

export const Route = lessonRoute
