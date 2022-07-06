import React, { useEffect, useState } from "react"
import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import './MomentPanel.css'

interface MomentPanelProps {
    currentTime: number
    duration: number
    moment: Moment
    active: boolean
    playing: boolean
    onStart: () => void
    onDelete: () => void
    onFinished: () => void
}

const MomentPanel = ({
    currentTime,
    duration,
    moment,
    active,
    playing,
    onStart,
    onDelete,
    onFinished,
}: MomentPanelProps) => {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (active) {
            let updatedProgress = 100 * (currentTime - moment.startTime) / ((moment.endTime || duration) - moment.startTime)

            if (updatedProgress < 0 || updatedProgress >= 100) {
                onFinished()
            }

            updatedProgress = updatedProgress < 0 ? 0 : updatedProgress
            updatedProgress = updatedProgress > 100 ? 100 : updatedProgress

            setProgress(updatedProgress)
        }
    }, [active, moment, currentTime, onFinished, duration])

    const deleteMoment = (event: React.MouseEvent) => {
        onDelete()
        event.stopPropagation()
    }

    return <div
        className={`moment-panel ${active ? 'active' : ''} ${playing && active ? 'pulse' : ''}`}
        onClick={() => onStart()}
    >
        <div className="button-delete" onClick={(e) => deleteMoment(e)} />

        <div className="times-container">
            <div className='time'>{secondsToHMSString(moment.startTime)}</div>
            <div className='time'>{secondsToHMSString(moment.endTime || duration)}</div>
        </div>

        {active && <div
            className="progress-indicator"
            style={{ backgroundImage: `conic-gradient(red ${progress}%, transparent 0)` }}
        ></div>}
    </div>
}

export default MomentPanel