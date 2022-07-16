import React from "react"
import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import './MomentPanel.css'

interface MomentPanelProps {
    moment: Moment
    active: boolean
    playing: boolean
    onStart: () => void
    onDelete: () => void
}

const MomentPanel = ({
    moment,
    active,
    playing,
    onStart,
    onDelete,
}: MomentPanelProps) => {
    const deleteMoment = (event: React.MouseEvent) => {
        onDelete()
        event.stopPropagation()
    }

    const handleTriggerClick = (e: any) => {
        e.preventDefault()
        console.log(e)
        console.log('handleTriggerClick')
    }

    return <div
        className={`moment-panel ${active ? 'active' : ''} ${playing && active ? 'pulse' : ''}`}
        onClick={onStart}
    >
        <div className="button-delete" onClick={deleteMoment} />
        <div className="trigger-indicator" onClick={handleTriggerClick}>
            <span className={`${moment.trigger ? '' : 'hidden'}`}>{moment.trigger || '_'}</span>
        </div>
        <div className='time'>{secondsToHMSString(moment.startTime)}</div>
    </div>
}

export default MomentPanel