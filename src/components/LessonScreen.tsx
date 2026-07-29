import React, { useState } from 'react'
import { X, Heart, Check, XCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Question } from '../types'

interface LessonScreenProps {
    lessonId?: string | number
    questions: Question[]
    onClose?: () => void
}

type FeedbackState = null | 'correct' | 'wrong'

export const LessonScreen: React.FC<LessonScreenProps> = ({
    questions,
    onClose,
}) => {
    const navigate = useNavigate()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<FeedbackState>(null)
    const [lives, setLives] = useState(3)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

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
    }

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
        const score = Math.round((correctAnswers / totalQuestions) * 100)
        const passed = score >= 70
        const lostLives = 3 - lives

        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* Ícone de resultado */}
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                        {passed ? (
                            <Check size={48} className="text-green-500" />
                        ) : (
                            <XCircle size={48} className="text-red-500" />
                        )}
                    </div>

                    {/* Título */}
                    <h2 className="text-3xl font-bold text-gray-800">
                        {passed ? 'Parabéns! 🎉' : 'Tente Novamente! 💪'}
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {passed
                            ? 'Você completou a lição com sucesso!'
                            : 'Você precisa de 70% para passar nesta lição.'}
                    </p>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4 py-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-gray-800">{correctAnswers}/{totalQuestions}</p>
                            <p className="text-sm text-gray-500">Acertos</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className={`text-2xl font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}>{score}%</p>
                            <p className="text-sm text-gray-500">Pontuação</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-2xl font-bold text-rose-500">{lostLives}</p>
                            <p className="text-sm text-gray-500">Vidas perdidas</p>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleClose}
                            className="bg-gray-200 text-gray-700 font-bold uppercase px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                            Sair
                        </button>
                        <button
                            onClick={handleRestart}
                            className="bg-violet-600 text-white font-bold uppercase px-6 py-3 rounded-xl hover:bg-violet-700 transition-colors"
                        >
                            Tentar Novamente
                        </button>
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
