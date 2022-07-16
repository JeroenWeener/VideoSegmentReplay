import { useEffect } from "react"
import { Moment } from "../../models/moment.model"

interface TriggerListenerProps {
    moments: Moment[]
    onPlay: (moment: Moment) => void
}

const TriggerListener = ({
    moments,
    onPlay,
}: TriggerListenerProps) => {
    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            const triggeredMoment = moments.find((m) => m.trigger === e.key)
            triggeredMoment && onPlay(triggeredMoment)
        }

        window.addEventListener('keyup', handleKeyUp)

        return () => window.removeEventListener('keyup', handleKeyUp)
    }, [moments, onPlay])

    return <></>
}

export default TriggerListener