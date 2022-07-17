import React, { MouseEvent, useState } from "react"
import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import TriggerDialog from "../trigger-dialog/TriggerDialog"
import TriggerListener from "../trigger-listener/TriggerListener"
import styles from './MomentPanel.module.scss'

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
        const momentWithoutTrigger = (({ trigger, ...m }) => m)(moment)
        onUpdate({ ...momentWithoutTrigger, ...(trigger && { trigger: trigger }) })
    }

    return <>
        <div
            className={`${styles.momentPanel} ${active ? styles.active : ''} ${playing && active ? styles.pulse : ''}`}
            onClick={onStart}
        >
            <div className={styles.buttonDelete} onClick={deleteMoment} />
            <div className={styles.triggerIndicator} onClick={handleTriggerClick}>
                <span className={`${moment.trigger ? '' : styles.hidden}`}>{moment.trigger || '_'}</span>
            </div>
            <div className={styles.time}>{secondsToHMSString(moment.startTime)}</div>
        </div>

        <TriggerListener trigger={moment.trigger} onTrigger={onStart} />

        {showTriggerDialog && <TriggerDialog onRegisterTrigger={handleTriggerRegister} onClose={() => setShowTriggerDialog(false)} />}
    </>
}

export default MomentPanel