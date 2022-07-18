import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Moment } from '../../models/moment.model'
import HistoryShortcutListener from '../history-shortcut-listener/HistoryShortcutListener'
import MomentPanel from '../moment-panel/MomentPanel'
import NewMomentPanel from '../new-moment-panel/NewMomentPanel'
import styles from './MomentPanelContainer.module.scss'

interface MomentPanelContainerProps {
    playing: boolean
    moments: Moment[]
    currentTime: number
    onUpdateMoments: (moments: Moment[]) => void
    onSeekTo: (seconds: number) => void
}

const MomentPanelContainer = ({
    playing,
    moments,
    currentTime,
    onUpdateMoments,
    onSeekTo,
}: MomentPanelContainerProps) => {
    const [activeMomentIndex, setActiveMomentIndex] = useState<number | null>(null)
    const [momentsHistory, setMomentsHistory] = useState<Moment[][]>([])
    const [historyPointer, setHistoryPointer] = useState<number>(0)

    const currentMoments: Moment[] = momentsHistory[historyPointer] || []

    if (activeMomentIndex) {
        const activeMoment = currentMoments[activeMomentIndex]
        if (activeMoment?.startTime > currentTime) {
            setActiveMomentIndex(null)
        }
    }

    useEffect(() => {
        const history = momentsHistory.slice(0, historyPointer + 1)
        setMomentsHistory([...history, moments])
        setHistoryPointer(history.length)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moments])

    const handleUndo = () => {
        setHistoryPointer(i => i === 0 ? 0 : --i)
    }

    const handleRedo = () => {
        setHistoryPointer(i => i === momentsHistory.length - 1 ? i : ++i)
    }

    /**
     * Creates a Moment at the current time.
     * The current time will be rounded to 1 decimal.
     */
    const createMoment = () => {
        const startTime = Math.round(currentTime * 10) / 10
        const updatedMoments = [...currentMoments, { startTime: startTime }]
        onUpdateMoments(updatedMoments)
    }

    const deleteMoment = (momentIndex: number) => {
        const updatedMoments = currentMoments.filter((_, i) => i !== momentIndex)
        if (momentIndex === activeMomentIndex) {
            setActiveMomentIndex(null)
        }
        onUpdateMoments(updatedMoments)
    }

    const activateMoment = (moment: Moment, index?: number) => {
        if (index === undefined) {
            index = currentMoments.findIndex(m => _.isEqual(m, moment))
        }
        if (index !== -1) {
            setActiveMomentIndex(index)
            onSeekTo(moment.startTime)
        }
    }

    const updateMoment = (updatedMoment: Moment, index: number): void => {
        const updatedMoments = currentMoments.map((m, i) => {
            // Replace old moment. Since multiple moments can be identical, only update the first
            if (index === i) {
                return updatedMoment
            }

            // Remove triggers from other moments that are under the same key
            if (m.trigger && m.trigger === updatedMoment.trigger) {
                return (({ trigger, ...m }) => m)(m)
            }

            return m
        })

        onUpdateMoments(updatedMoments)
    }

    return <>
        <div>
            <button
                disabled={historyPointer === 0}
                onClick={handleUndo}
            >
                Undo
            </button>
            <button
                disabled={historyPointer === momentsHistory.length - 1}
                onClick={handleRedo}
            >
                Redo
            </button>
        </div>
        <div className={styles.panelContainer}>
            {currentMoments.map((moment: Moment, index: number) =>
                <MomentPanel
                    key={index}
                    moment={moment}
                    active={index === activeMomentIndex}
                    playing={playing}
                    onStart={() => activateMoment(moment, index)}
                    onDelete={() => deleteMoment(index)}
                    onUpdate={(updatedMoment) => updateMoment(updatedMoment, index)}
                />
            )}

            <NewMomentPanel onClick={createMoment} />
        </div>

        <HistoryShortcutListener onUndo={handleUndo} onRedo={handleRedo} />
    </>
}

export default MomentPanelContainer