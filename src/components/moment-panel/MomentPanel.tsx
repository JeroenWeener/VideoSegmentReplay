import React from "react"
import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import './MomentPanel.css'

interface MomentPanelProps {
    currentTime: number
    moment: Moment
    active: boolean
    playing: boolean
    onStart: () => void
    onDelete: () => void
    onFinished: () => void
}

const MomentPanel = ({
    currentTime,
    moment,
    active,
    playing,
    onStart,
    onDelete,
    onFinished,
}: MomentPanelProps) => {
    let progress = 100 * (currentTime - moment.startTime) / (moment.endTime! - moment.startTime)
    progress = progress < 0 ? 0 : progress
    progress = progress > 100 ? 100 : progress
    
    if (active && progress === 100) {
        onFinished()
    }

    const deleteMoment = (event: React.MouseEvent) => {
        onDelete()
        event.stopPropagation()
    }

    return <div
        className={`moment-panel ${active ? 'active' : ''} ${active && playing ? 'pulse' : ''}`}
        onClick={() => onStart()}
    >
        <div className="button-delete" onClick={(e) => deleteMoment(e)} />
        <div className='time'>{secondsToHMSString(moment.startTime)}</div>

        {active && <div
            className="progress-indicator"
            style={{ backgroundImage: `conic-gradient(red ${progress}%, transparent 0)` }}
        ></div>}
    </div>
}

export default MomentPanel