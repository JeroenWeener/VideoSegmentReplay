import { useState } from 'react'
import { Moment } from '../../models/moment.model'
import MomentPanel from '../moment-panel/MomentPanel'
import NewMomentPanel from '../new-moment-panel/NewMomentPanel'
import './MomentPanelContainer.css'

interface MomentPanelContainerProps {
    playing: boolean
    moments: Moment[]
    momentsUpdated: (moments: Moment[]) => void
    currentTime: number
    duration: number
    seekTo: (seconds: number) => void
    onPause: () => void
}

const MomentPanelContainer = ({
    playing,
    moments,
    momentsUpdated,
    currentTime,
    duration,
    seekTo,
    onPause,
}: MomentPanelContainerProps) => {
    const [activeMomentIndex, setActiveMomentIndex] = useState<number | null>(null)

    /**
     * Creates a Moment at the currentTime.
     * The current time will be rounded to 1 decimal.
     */
    const createMoment = () => {
        const startTime = Math.round(currentTime * 10) / 10
        const updatedMoments = [...moments, {
            startTime: startTime,
            endTime: startTime + 10,
        }]
        momentsUpdated(updatedMoments)
    }

    const deleteMoment = (momentIndex: number) => {
        const updatedMoments = moments.filter((_, i) => i !== momentIndex)
        if (momentIndex === activeMomentIndex) {
            setActiveMomentIndex(null)
        }
        momentsUpdated(updatedMoments)
    }

    const activateMoment = (moment: Moment, index: number) => {
        setActiveMomentIndex(index)
        seekTo(moment.startTime)
    }

    const deactivateMoment = () => {
        setActiveMomentIndex(null)
        // onPause()
    }

    return <div className='panel-container'>
        {moments.map((moment: Moment, index: number) =>
            <MomentPanel
                key={index}
                currentTime={currentTime}
                duration={duration}
                moment={moment}
                active={index === activeMomentIndex}
                playing={playing}
                onStart={() => activateMoment(moment, index)}
                onDelete={() => deleteMoment(index)}
                onFinished={deactivateMoment}
            />
        )}
        
        <NewMomentPanel onClick={createMoment} />

        {moments.length === 0 &&
            <div style={{ visibility: 'hidden' }}><NewMomentPanel /></div>
        }
    </div>
}

export default MomentPanelContainer