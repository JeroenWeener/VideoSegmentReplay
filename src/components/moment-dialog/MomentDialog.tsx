import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Moment } from "../../models/moment.model"
import { momentIdeas } from "../../utils/moment.util"
import { getRandom } from "../../utils/random.util"
import Dialog from "../dialog/Dialog"
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
    const [momentIdea] = useState<{ description: string }>(getRandom(momentIdeas))

    const handleOnSubmit = (event: FormEvent) => {
        event.preventDefault()
        onUpdateMoment({
            id: moment.id,
            description: momentDescription,
            startTime: moment.startTime,
        })
    }

    const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMomentDescription(e.target.value)
    }

    return <>
        <Dialog onClose={onClose}>
            <h2>Edit moment</h2>

            <form className={styles.momentDialogForm} onSubmit={handleOnSubmit}>
                <div>
                    <label>
                        Moment description
                        <input
                            autoFocus type='text'
                            value={momentDescription}
                            placeholder={momentIdea.description}
                            onKeyUp={(e) => e.stopPropagation()} // prevent app shortcuts from triggering
                            onKeyDown={(e) => e.stopPropagation()} // prevent app shortcuts from triggering
                            onChange={onDescriptionChange}
                        />
                    </label>
                </div>

                <input type='submit' value='Update' />
            </form>
        </Dialog>
    </>
}

export default MomentDialog