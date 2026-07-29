import { createFileRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import { LearningPath, LearningUnit } from '../components/LearningPath'
import { useUnits } from '../hooks/useUnits'

function HomePage() {
    const { units, loading } = useUnits()

    const learningUnits: LearningUnit[] = units.map((unit, index) => {
        const allPreviousCompleted = units
            .slice(0, index)
            .every((u) => u.lessons.every((l) => l.completed))

        let status: 'locked' | 'available' | 'completed'
        if (index === 0 || allPreviousCompleted) {
            status = 'available'
        } else {
            status = 'locked'
        }

        // Check if all lessons are completed
        if (unit.lessons.length > 0 && unit.lessons.every((l) => l.completed)) {
            status = 'completed'
        }

        return {
            id: unit.id,
            status,
            unitData: unit,
        }
    })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                    <p className="text-slate-600 text-sm">Carregando unidades...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Escolha uma unidade</h1>
                    <p className="text-slate-500 mt-2">Complete as lições para avançar</p>
                </div>
                <LearningPath units={learningUnits} />
            </main>
        </div>
    )
}

export const Route = createFileRoute('/')({
    component: HomePage,
})

