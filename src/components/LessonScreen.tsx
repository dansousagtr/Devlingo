import React, { useEffect, useRef, useState } from 'react'
import { X, Heart, Check, XCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Question } from '../types'
import owl from '../assets/images/devlingo-char.png'

interface LessonScreenProps {
    lessonId?: string | number
    lessonTitle?: string
    lessonXp?: number
    unitId?: string | number
    questions: Question[]
    onClose?: () => void
    onComplete?: (lessonTitle: string, unitId: string | number) => void
}

type FeedbackState = null | 'correct' | 'wrong'

export const LessonScreen: React.FC<LessonScreenProps> = ({
    lessonId,
    lessonTitle,
    lessonXp,
    unitId,
    questions,
    onClose,
    onComplete,
}) => {
    const navigate = useNavigate()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<FeedbackState>(null)
    const [lives, setLives] = useState(3)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const completionReportedRef = useRef(false)

    const currentQuestion = questions[currentQuestionIndex]
    const progress = questions.length > 0
        ? ((currentQuestionIndex + (feedback ? 1 : 0)) / questions.length) * 100
        : 0

    const handleSelectOption = (index: number) => {
        if (feedback !== null) return // bloqueia seleção durante feedback
        setSelectedOption(index)
    }

    const handleVerify = () => {
        if (selectedOption === null || feedback !== null) return

        if (selectedOption === currentQuestion.correctAnswer) {
            setCorrectAnswers(correctAnswers + 1)
            setFeedback('correct')
        } else {
            setLives(lives - 1)
            setFeedback('wrong')
        }
    }

    const handleContinue = () => {
        if (lives === 0) {
            navigate({ to: '/' })
            return
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedOption(null)
            setFeedback(null)
        } else {
            setIsComplete(true)
        }
    }

    const handleSkip = () => {
        if (feedback !== null) return
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedOption(null)
        } else {
            setIsComplete(true)
        }
    }

    const handleClose = () => {
        onClose?.()
        navigate({ to: '/' })
    }

    const handleRestart = () => {
        setCurrentQuestionIndex(0)
        setSelectedOption(null)
        setFeedback(null)
        setLives(3)
        setCorrectAnswers(0)
        setIsComplete(false)
        completionReportedRef.current = false
    }

    useEffect(() => {
        if (!isComplete || !lessonId || !unitId || completionReportedRef.current) {
            return
        }

        const totalQuestions = questions.length
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

        if (score >= 70) {
            completionReportedRef.current = true
            if (lessonTitle && unitId) {
                onComplete?.(lessonTitle, unitId)
            }
        }
    }, [correctAnswers, isComplete, lessonId, lessonTitle, onComplete, questions.length, unitId])

    const getOptionStyle = (index: number) => {
        if (feedback === null) {
            // Estado normal (idle ou selecionado)
            if (selectedOption === index) {
                return 'bg-blue-100 border-blue-400 text-blue-900'
            }
            return 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
        }

        // Estado de feedback - mostrar resultado
        if (index === currentQuestion.correctAnswer) {
            return 'bg-green-100 border-green-500 text-green-900'
        }
        if (feedback === 'wrong' && index === selectedOption) {
            return 'bg-red-100 border-red-500 text-red-900'
        }
        return 'bg-gray-50 border-gray-200 text-gray-400'
    }

    const getBadgeStyle = (index: number) => {
        if (feedback === null) {
            if (selectedOption === index) {
                return 'bg-blue-400 border-blue-500 text-white'
            }
            return 'border-gray-300 text-gray-600'
        }

        if (index === currentQuestion.correctAnswer) {
            return 'bg-green-500 border-green-600 text-white'
        }
        if (feedback === 'wrong' && index === selectedOption) {
            return 'bg-red-500 border-red-600 text-white'
        }
        return 'border-gray-300 text-gray-400'
    }

    // Tela de conclusão
    if (isComplete) {
        const totalQuestions = questions.length
        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
        const passed = score >= 70
        const wrongAnswers = totalQuestions - correctAnswers
        const precision = score
        const xpEarned = lessonXp ?? 0

        if (passed) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="w-full max-w-xl rounded-[40px] bg-white shadow-[0_35px_80px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden">
                        <div className="bg-white px-10 pt-12 pb-8 text-center">
                            <div className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-purple-100 shadow-inner">
                                <img src={owl} alt="Coruja Devlingo" className="h-24 w-24 object-contain" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900">Lição concluída!</h1>
                            <p className="mt-3 text-base text-slate-500">Parabéns, você finalizou a lição com sucesso.</p>
                        </div>

                        <div className="bg-slate-50 px-8 pb-10">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 text-left shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Total de XP</p>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-amber-700 text-xl">💎</div>
                                        <p className="text-3xl font-extrabold text-amber-800">{xpEarned}</p>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 text-left shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Boa</p>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 text-xl">🎯</div>
                                        <p className="text-3xl font-extrabold text-emerald-800">{precision}%</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="mt-10 w-full rounded-3xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl rounded-[40px] bg-white shadow-[0_35px_80px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden">
                    <div className="bg-white px-8 pt-12 pb-10 text-center">
                        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-purple-100 shadow-inner">
                            <img src={owl} alt="Coruja Devlingo" className="h-20 w-20 object-contain" />
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900">Você quase conseguiu!</h1>
                        <p className="mt-3 text-base text-slate-500">Continue praticando para melhorar.</p>
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50 px-8 py-8">
                        <div className="grid gap-4">
                            <div className="rounded-[24px] bg-white p-5 shadow-sm border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                        <Check size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Respostas corretas</p>
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{correctAnswers}</p>
                            </div>

                            <div className="rounded-[24px] bg-white p-5 shadow-sm border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                                        <X size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Respostas incorretas</p>
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{wrongAnswers}</p>
                            </div>

                            <div className="rounded-[24px] bg-white p-5 shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between text-sm text-slate-600">
                                    <span>Precisão</span>
                                    <span className="font-semibold text-slate-900">{precision}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button
                                onClick={handleClose}
                                className="w-full sm:w-auto rounded-3xl border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleRestart}
                                className="w-full sm:w-auto rounded-3xl bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Caso não haja questões
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <XCircle size={48} className="text-gray-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        Nenhuma questão disponível
                    </h2>
                    <p className="text-gray-500">
                        Esta lição ainda não possui questões cadastradas.
                    </p>
                    <button
                        onClick={handleClose}
                        className="bg-gray-200 text-gray-700 font-bold uppercase px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center gap-4 p-6 border-b border-gray-100">
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    aria-label="Fechar lição"
                >
                    <X size={28} />
                </button>

                {/* Progress Bar */}
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Lives */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Heart
                        size={24}
                        className={`fill-red-500 text-red-500 ${lives === 0 ? 'opacity-30' : ''}`}
                    />
                    <span className={`font-bold text-lg ${lives === 0 ? 'text-gray-400' : 'text-rose-500'}`}>
                        {lives}
                    </span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-12">
                {/* Question Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                    {currentQuestion.title}
                </h2>

                {/* Options Grid */}
                <div className="space-y-4 flex-1">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectOption(index)}
                            disabled={feedback !== null}
                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${getOptionStyle(index)} ${feedback !== null ? 'cursor-default' : 'cursor-pointer'
                                }`}
                        >
                            <span
                                className={`text-left font-medium flex items-center gap-3 ${feedback !== null && index === currentQuestion.correctAnswer
                                        ? 'text-green-900'
                                        : feedback === 'wrong' && index === selectedOption
                                            ? 'text-red-900'
                                            : feedback !== null
                                                ? 'text-gray-400'
                                                : 'text-gray-800'
                                    }`}
                            >
                                {/* Ícone de feedback */}
                                {feedback !== null && index === currentQuestion.correctAnswer && (
                                    <Check size={20} className="text-green-600 flex-shrink-0" />
                                )}
                                {feedback === 'wrong' && index === selectedOption && (
                                    <XCircle size={20} className="text-red-600 flex-shrink-0" />
                                )}
                                {option}
                            </span>

                            {/* Badge */}
                            <div
                                className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center text-xs font-semibold ml-3 transition-all duration-200 ${getBadgeStyle(index)}`}
                            >
                                {index + 1}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Feedback message */}
                {feedback !== null && (
                    <div className={`mt-6 p-4 rounded-xl ${feedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`font-semibold ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                            {feedback === 'correct'
                                ? '✅ Resposta correta!'
                                : lives > 0
                                    ? '❌ Resposta incorreta! Você perdeu uma vida.'
                                    : '💀 Você ficou sem vidas!'}
                        </p>
                        {feedback === 'wrong' && lives > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                                A resposta correta era: <span className="font-bold">{currentQuestion.options[currentQuestion.correctAnswer]}</span>
                            </p>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 p-6">
                <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
                    {feedback === null ? (
                        <>
                            <button
                                onClick={handleSkip}
                                className="bg-gray-200 text-gray-700 font-bold uppercase px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors text-sm"
                            >
                                Pular
                            </button>

                            <button
                                onClick={handleVerify}
                                disabled={selectedOption === null}
                                className={`font-bold uppercase px-8 py-3 rounded-xl transition-colors text-sm ${selectedOption !== null
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-green-300 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Verificar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleContinue}
                            className={`w-full font-bold uppercase px-8 py-3 rounded-xl transition-colors text-sm text-white ${lives === 0
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            {lives === 0 ? 'Voltar ao início' : 'Continuar'}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default LessonScreen
