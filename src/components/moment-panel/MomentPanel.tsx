import React, { MouseEvent, useState } from "react"
import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import TriggerDialog from "../trigger-dialog/TriggerDialog"
import './MomentPanel.css'

interface MomentPanelProps {
    moment: Moment
    active: boolean
    playing: boolean
    onStart: () => void
    onDelete: () => void
    onUpdate: (updatedMoment: Moment) => void
}

const MomentPanel = ({
    moment,
    active,
    playing,
    onStart,
    onDelete,
    onUpdate,
}: MomentPanelProps) => {
    const [showTriggerDialog, setShowTriggerDialog] = useState<boolean>(false)

    const deleteMoment = (event: React.MouseEvent) => {
        event.stopPropagation()
        onDelete()
    }

    const handleTriggerClick = (e: MouseEvent) => {
        e.stopPropagation()
        setShowTriggerDialog(true)
    }

    const handleTriggerRegister = (trigger?: string) => {
        setShowTriggerDialog(false)
        const updatedMoment = moment
        delete updatedMoment.trigger
        onUpdate({ ...updatedMoment, ...(trigger && { trigger: trigger }) })
    }

    return <>
        <div
            className={`moment-panel ${active ? 'active' : ''} ${playing && active ? 'pulse' : ''}`}
            onClick={onStart}
        >
            <div className="button-delete" onClick={deleteMoment} />
            <div className="trigger-indicator" onClick={handleTriggerClick}>
                <span className={`${moment.trigger ? '' : 'hidden'}`}>{moment.trigger || '_'}</span>
            </div>
            <div className='time'>{secondsToHMSString(moment.startTime)}</div>
        </div>

        {showTriggerDialog && <TriggerDialog onRegisterTrigger={handleTriggerRegister} onClose={() => setShowTriggerDialog(false)} />}
    </>
}

export default MomentPanel