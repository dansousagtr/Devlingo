import React from 'react'
import { X, Check } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Lesson, Unit } from '../types'
import owl from '../assets/images/devlingo-char.png'

interface LessonsModalProps {
    isOpen: boolean
    onClose: () => void
    unit: Unit
    onLessonClick?: (lesson: Lesson, unitId: string | number) => void
}

export const LessonsModal: React.FC<LessonsModalProps> = ({
    isOpen,
    onClose,
    unit,
    onLessonClick,
}) => {
    const navigate = useNavigate()

    if (!isOpen) return null

    const handleLessonClick = (lesson: any) => {
        onLessonClick?.(lesson, unit.id)
        navigate({ to: `/lessons/${lesson.id}` })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gradient-to-b from-purple-600 to-purple-700 rounded-[32px] w-full max-w-4xl p-8 shadow-2xl overflow-hidden">
                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-purple-200 hover:text-white transition-colors z-20"
                    aria-label="Fechar modal"
                >
                    <X size={28} />
                </button>

                {/* Cabeçalho */}
                <div className="text-center mb-8 pr-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Escolha uma lição</h2>
                    <p className="text-base text-purple-100">Unidade {unit.number}</p>
                </div>

                {/* Lista de Lições */}
                <div className="space-y-4 mb-8 max-h-[460px] overflow-y-auto">
                    {unit.lessons.length > 0 ? (
                        unit.lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson)}
                                className={`
                    flex items-center justify-between p-5 rounded-3xl cursor-pointer
                    transition-all duration-200 hover:bg-purple-500/90
                    ${lesson.completed
                                        ? 'bg-purple-500 border-2 border-green-400'
                                        : 'bg-purple-500/80 border-2 border-transparent'
                                    }
                    `}
                            >
                                {/* Conteúdo de Texto */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-lg md:text-xl">{lesson.title}</h3>
                                    <p className="text-purple-100 text-sm mt-1">{lesson.description}</p>
                                    <p className="text-purple-200 text-xs mt-3">+{lesson.xp} XP</p>
                                </div>

                                {/* Ícone de Status */}
                                <div className="flex-shrink-0 ml-4">
                                    {lesson.completed ? (
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                            <Check size={20} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center shadow-inner">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 rounded-3xl bg-purple-500/80 border border-purple-400 text-center text-purple-100">
                            <p className="font-medium">Nenhuma lição disponível para esta unidade.</p>
                            <p className="text-sm text-purple-200 mt-2">Verifique as unidades anteriores ou aguarde novas lições.</p>
                        </div>
                    )}
                </div>

                {/* Personagem - Coruja */}
                <div className="absolute -bottom-10 -right-10 w-36 h-36 pointer-events-none z-10">
                    <img
                        src={owl}
                        alt="devlingo owl"
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>
            </div>
        </div>
    )
}

export default LessonsModal
