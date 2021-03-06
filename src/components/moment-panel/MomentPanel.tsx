import React, { MouseEvent, useState } from "react"
import { MdEdit } from "react-icons/md"
import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import MomentDialog from "../moment-dialog/MomentDialog"
import TriggerDialog from "../trigger-dialog/TriggerDialog"
import TriggerListener from "../trigger-listener/TriggerListener"
import styles from './MomentPanel.module.scss'

interface MomentPanelProps {
    moment: Moment
    active: boolean
    playing: boolean
    editing: boolean
    onStart: () => void
    onDelete: () => void
    onUpdate: (updatedMoment: Moment) => void
}

const MomentPanel = ({
    moment,
    active,
    playing,
    editing,
    onStart,
    onDelete,
    onUpdate,
}: MomentPanelProps) => {
    const [showMomentDialog, setShowMomentDialog] = useState<boolean>(false)
    const [showTriggerDialog, setShowTriggerDialog] = useState<boolean>(false)
    const [isTriggerDown, setIsTriggerDown] = useState<boolean>(false)

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

    const handleTriggerDown = () => {
        setIsTriggerDown(true)
    }

    const handleTriggerUp = () => {
        setIsTriggerDown(false)
        onStart()
    }

    const handleEditClick = (e: MouseEvent) => {
        e.stopPropagation()
        setShowMomentDialog(true)
    }

    const handleMomentUpdate = (moment: Moment) => {
        onUpdate(moment)
        setShowMomentDialog(false)
    }

    return <>
        <div
            className={`${styles.momentPanel} ${playing && active ? styles.pulse : ''} ${isTriggerDown ? styles.highlighted : ''}`}
            onClick={onStart}
        >
            <div className={styles.header}>
                <div className={`${styles.triggerIndicator} ${editing ? '' : styles.hidden}`} onClick={(e) => editing && handleTriggerClick(e)}>
                    <span className={`${moment.trigger ? '' : styles.hidden}`}>{moment.trigger || '_'}</span>
                </div>

                <div className={`${styles.buttonDelete} ${editing ? '' : styles.hidden}`} onClick={(e) => editing && deleteMoment(e)} />
            </div>
            {moment.description !== undefined ? <>
                <div className={styles.description}>{moment.description}</div>
                <div className={styles.time}>{secondsToHMSString(moment.startTime, true)}</div>
            </> :
                <>
                    <div className={styles.description}>{secondsToHMSString(moment.startTime, true)}</div>
                    <div />
                </>
            }

            <div className={`${styles.editOverlay} ${editing ? '' : styles.hidden}`}>
                <button className={styles.editOverlayButton} onClick={handleEditClick}>
                    <MdEdit />
                </button>
            </div>
        </div>

        <TriggerListener trigger={moment.trigger} onTriggerDown={handleTriggerDown} onTriggerUp={handleTriggerUp} />

        {showTriggerDialog && <TriggerDialog onRegisterTrigger={handleTriggerRegister} onClose={() => setShowTriggerDialog(false)} />}
        {showMomentDialog && <MomentDialog onUpdateMoment={(moment) => handleMomentUpdate(moment)} onClose={() => setShowMomentDialog(false)} moment={moment} />}
    </>
}

export default MomentPanel