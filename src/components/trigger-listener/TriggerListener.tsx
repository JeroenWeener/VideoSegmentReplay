import { useEffect } from "react"

interface TriggerListenerProps {
    trigger?: string
    onTrigger: () => void
}

const TriggerListener = ({
    trigger,
    onTrigger,
}: TriggerListenerProps) => {
    useEffect(() => {
        if (!trigger || !onTrigger) return

        const handleKeyUp = (e: KeyboardEvent) => {
            trigger === e.key && onTrigger()
        }

        window.addEventListener('keyup', handleKeyUp)

        return () => window.removeEventListener('keyup', handleKeyUp)
    }, [trigger, onTrigger])

    return <></>
}

export default TriggerListener