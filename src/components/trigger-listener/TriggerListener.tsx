import { useEffect } from "react"

interface TriggerListenerProps {
    trigger?: string
    onTriggerDown: () => void
    onTriggerUp: () => void
}

const TriggerListener = ({
    trigger,
    onTriggerDown,
    onTriggerUp,
}: TriggerListenerProps) => {
    useEffect(() => {
        if (!trigger || !onTriggerDown || !onTriggerUp) return
        
        const handleKeyDown = (e: KeyboardEvent) => {
            trigger === e.key && onTriggerDown()
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            trigger === e.key && onTriggerUp()
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [trigger, onTriggerDown, onTriggerUp])

    return <></>
}

export default TriggerListener