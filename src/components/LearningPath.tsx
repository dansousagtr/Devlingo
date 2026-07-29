import React, { useState } from 'react'
import greenStar from '../assets/images/green-star.png'
import grayStar from '../assets/images/gray-star.png'
import owl from '../assets/images/devlingo-char.png'
import LessonsModal from './LessonsModal'
import { Unit } from '../types'

export type UnitStatus = 'locked' | 'available' | 'completed'

export type LearningUnit = {
    id: string | number
    status: UnitStatus
    unitData?: Unit
}

type Props = {
    units: LearningUnit[]
    onUnitClick?: (unit: LearningUnit, index: number) => void
}


export const LearningPath: React.FC<Props> = ({ units, onUnitClick }) => {
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleUnitClick = (unit: LearningUnit, index: number) => {
        onUnitClick?.(unit, index)
        if (unit.unitData) {
            setSelectedUnit(unit.unitData)
            setIsModalOpen(true)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedUnit(null)
    }

    return (
        <>
            <section className="w-full flex justify-center py-6">
                <div className="relative flex flex-col items-center">
                {units.map((u, idx) => {
                    // Offset sequence (px) for indices 0..5: 0, -20, -40, -60, -40, -20
                    // Offset sequence for 5 stars: 0, -20, -40, -60, -40
                    const seq = [0, -20, -40, -60, -40]
                    const offset = seq[idx % seq.length] ?? 0

                    const isCompleted = u.status === 'completed'
                    const enabled = idx === 0 || units[idx - 1]?.status === 'completed'

                    return (
                        <div key={u.id} className="relative my-6 flex items-center">
                            <div
                                className={`${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                                style={{ transform: `translateX(${offset}px)` }}
                                onClick={() => enabled && handleUnitClick(u, idx)}
                                aria-disabled={!enabled}
                                role="button"
                                tabIndex={enabled ? 0 : -1}
                            >
                                <img
                                    src={isCompleted ? greenStar : grayStar}
                                    alt={`unit-${u.id}`}
                                    className={`w-20 h-20 object-contain ${enabled ? 'transition-transform duration-200 hover:scale-110' : ''}`}
                                />

                                {idx === 2 && (
                                    <img
                                        src={owl}
                                        alt="devlingo owl"
                                        className="absolute left-[120%] top-1/2 -translate-y-1/2 w-20 h-20 animate-float pointer-events-none"
                                        style={{ zIndex: 10 }}
                                    />
                                )}

                                {!enabled && !isCompleted && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-2xl select-none"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            </section>
            
            {selectedUnit && (
                <LessonsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    unit={selectedUnit}
                />
            )}
        </>
    )
}

export default LearningPath
