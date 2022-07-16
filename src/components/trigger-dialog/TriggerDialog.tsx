import { useEffect } from "react"
import { isValidTrigger } from "../../utils/regex.util"
import Dialog from "../dialog/Dialog"

interface TriggerDialogProps {
    onRegisterTrigger: (trigger: string) => void
    onClose: () => void
}

const TriggerDialog = ({
    onRegisterTrigger,
    onClose,
}: TriggerDialogProps) => {

    useEffect(() => {
        const handleTriggerInput = (e: KeyboardEvent) => {
            if (isValidTrigger(e.key)) {
                onRegisterTrigger(e.key)
            }
        }

        window.addEventListener('keyup', handleTriggerInput)
        return () => window.removeEventListener('keyup', handleTriggerInput)
    }, [onRegisterTrigger])

    return <Dialog onClose={onClose}>Press a key to register it as a trigger</Dialog>
}

export default TriggerDialog