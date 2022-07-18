import { useState } from 'react'
import { Moment } from '../../models/moment.model'
import { buildNewMoment } from '../../utils/moment.util'
import HistoryShortcutListener from '../history-shortcut-listener/HistoryShortcutListener'
import MomentPanel from '../moment-panel/MomentPanel'
import NewMomentPanel from '../new-moment-panel/NewMomentPanel'
import styles from './MomentPanelContainer.module.scss'

interface MomentPanelContainerProps {
    playing: boolean
    initialMoments: Moment[]
    currentTime: number
    onUpdateMoments: (moments: Moment[]) => void
    onSeekTo: (seconds: number) => void
}

const MomentPanelContainer = ({
    playing,
    initialMoments,
    currentTime,
    onUpdateMoments,
    onSeekTo,
}: MomentPanelContainerProps) => {
    const [activeMomentId, setActiveMomentId] = useState<number | null>(null)
    const [momentsHistory, setMomentsHistory] = useState<Moment[][]>([[...initialMoments]])
    const [historyPointer, setHistoryPointer] = useState<number>(0)

    const currentMoments: Moment[] = momentsHistory[historyPointer] || []

    if (activeMomentId) {
        const activeMoment = currentMoments.find(m => m.id === activeMomentId)
        if (!activeMoment || currentTime < activeMoment.startTime) {
            setActiveMomentId(null)
        }
    }

    /**
     * Updates the current moments:
     * - updates moments history
     * - emits updated moments to parent
     * 
     * @param moments the updated moments
     */
    const updateMoments = (moments: Moment[]) => {
        const history = momentsHistory.slice(0, historyPointer + 1)
        setMomentsHistory([...history, moments])
        setHistoryPointer(history.length)
        onUpdateMoments(moments)
    }

    /**
     * Undoes an operation to the moments by going back in the history.
     * Emits new current moments to parent.
     */
    const handleUndo = () => {
        const newHistoryPointer = historyPointer === 0 ? 0 : historyPointer - 1
        setHistoryPointer(newHistoryPointer)
        onUpdateMoments(momentsHistory[newHistoryPointer])
    }

    /**
     * Redoes an operation that was previously undone by going forward in the history.
     * Emits the new current moments to parent.
     */
    const handleRedo = () => {
        const newHistoryPointer = historyPointer === momentsHistory.length - 1 ? historyPointer : historyPointer + 1
        setHistoryPointer(newHistoryPointer)
        onUpdateMoments(momentsHistory[newHistoryPointer])
    }

    /**
     * Creates a Moment at the current time.
     * The current time will be rounded to 1 decimal.
     */
    const createMoment = () => {
        const startTime = Math.round(currentTime * 10) / 10
        const updatedMoments = [...currentMoments, buildNewMoment(startTime)]
        updateMoments(updatedMoments)
    }

    const deleteMoment = (moment: Moment) => {
        const updatedMoments = currentMoments.filter(m => m.id !== moment.id)
        if (moment.id === activeMomentId) {
            setActiveMomentId(null)
        }
        updateMoments(updatedMoments)
    }

    const activateMoment = (moment: Moment) => {
        setActiveMomentId(moment.id)
        onSeekTo(moment.startTime)
    }

    const updateMoment = (updatedMoment: Moment): void => {
        const updatedMoments = currentMoments.map(m => {
            // Replace old moment
            if (m.id === updatedMoment.id) {
                return updatedMoment
            }

            // Remove triggers from other moments that are under the same key
            if (m.trigger && m.trigger === updatedMoment.trigger) {
                return (({ trigger, ...m }) => m)(m)
            }

            return m
        })

        updateMoments(updatedMoments)
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
            {currentMoments.map(moment =>
                <MomentPanel
                    key={moment.id}
                    moment={moment}
                    active={moment.id === activeMomentId}
                    playing={playing}
                    onStart={() => activateMoment(moment)}
                    onDelete={() => deleteMoment(moment)}
                    onUpdate={updateMoment}
                />
            )}

            <NewMomentPanel onClick={createMoment} />
        </div>

        <HistoryShortcutListener onUndo={handleUndo} onRedo={handleRedo} />
    </>
}

export default MomentPanelContainer