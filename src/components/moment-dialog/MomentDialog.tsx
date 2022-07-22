import { FormEvent, KeyboardEvent, useState } from "react"
import { Moment } from "../../models/moment.model"
import { momentIdeas } from "../../utils/moment.util"
import { getRandom } from "../../utils/random.util"
import Dialog from "../dialog/Dialog"
import TimeInput from "../time-input/TimeInput"
import styles from './MomentDialog.module.scss'

interface MomentDialogProps {
    moment: Moment
    onUpdateMoment: (moment: Moment) => void
    onClose: () => void
}

const MomentDialog = ({
    moment,
    onUpdateMoment,
    onClose,
}: MomentDialogProps) => {
    const [momentDescription, setMomentDescription] = useState<string>(moment.description || '')
    const [momentStartTime, setMomentStartTime] = useState<number>(moment.startTime)
    const [momentIdea] = useState<{ description: string }>(getRandom(momentIdeas))

    const handleOnSubmit = (event: FormEvent) => {
        event.preventDefault()
        onUpdateMoment({
            id: moment.id,
            description: momentDescription,
            startTime: momentStartTime,
        })
    }

    /**
     * Prevent keyboard events from propagating unless its the escape key, as this is used by the parent dialog to close.
     * 
     * @param e
     */
    const preventAppTriggers = (e: KeyboardEvent) => {
        if (
            e.key !== 'Escape' &&
            e.code !== 'Escape' &&
            e.keyCode !== 27
        ) {
            e.stopPropagation()
        }
    }

    return <>
        <Dialog onClose={onClose}>
            <h2>Edit moment</h2>

            <form className={styles.momentDialogForm} onSubmit={handleOnSubmit}>
                <div
                    onKeyDown={preventAppTriggers} // prevent app shortcuts from triggering
                    onKeyUp={preventAppTriggers} // prevent app shortcuts from triggering
                >
                    <label>
                        Moment description
                        <input
                            autoFocus
                            type='text'
                            value={momentDescription}
                            placeholder={momentIdea.description}
                            onChange={(e) => setMomentDescription(e.target.value)}
                        />
                    </label>

                    <label>
                        Start time
                        <TimeInput initialSeconds={momentStartTime} onSecondsUpdated={setMomentStartTime} />
                    </label>
                </div>

                <input type='submit' value='Update' />
            </form>
        </Dialog>
    </>
}

export default MomentDialog