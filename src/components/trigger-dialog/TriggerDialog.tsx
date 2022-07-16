import { useEffect } from "react"
import { isValidTrigger } from "../../utils/regex.util"
import Dialog from "../dialog/Dialog"
import './TriggerDialog.css'

interface TriggerDialogProps {
    onRegisterTrigger: (trigger?: string) => void
    onClose: () => void
}

const TriggerDialog = ({
    onRegisterTrigger,
    onClose,
}: TriggerDialogProps) => {

    useEffect(() => {
        const handleTriggerInput = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (isValidTrigger(e.key)) {
                onRegisterTrigger(e.key)
            } else if (
                e.key === 'Backspace' ||
                e.keyCode === 8 ||
                e.code === 'Backspace'
            ) {
                onRegisterTrigger()
            }
        }

        // Register event listeners at body so they take precedence over other listeners (that are attached to window)
        document.body.addEventListener('keyup', handleTriggerInput)

        return () => document.body.removeEventListener('keyup', handleTriggerInput)
    }, [onRegisterTrigger])

    return <Dialog onClose={onClose}>
        <div className="trigger-dialog">
            <div>Press a key to register it as a trigger</div>
            <div className="small-text">OR</div>
            <button className="remove-trigger-button" onClick={() => onRegisterTrigger()}>Remove trigger</button>
        </div>
    </Dialog>
}

export default TriggerDialog