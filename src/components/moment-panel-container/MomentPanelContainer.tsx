import { Moment } from '../../models/moment.model'
import MomentPanel from '../moment-panel/MomentPanel'
import NewMomentPanel from '../new-moment-panel/NewMomentPanel'
import './MomentPanelContainer.css'

interface MomentPanelContainerProps {
    moments: Moment[]
    momentsUpdated: (moments: Moment[]) => void
    currentTime: number
    seekTo: Function
}

const MomentPanelContainer = ({
    moments,
    momentsUpdated,
    currentTime,
    seekTo,
}: MomentPanelContainerProps) => {
    /**
     * Creates a Moment at the currentTime.
     * 
     * The current time will be rounded to 1 decimal
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
        momentsUpdated(updatedMoments)
    }

    return <div className='panel-container'>
        {moments.map((moment: Moment, index: number) =>
            <MomentPanel
                key={index}
                currentTime={currentTime}
                moment={moment}
                onStart={() => seekTo(moment.startTime)}
                onDelete={() => deleteMoment(index)}
            />
        )}
        <NewMomentPanel onClick={createMoment} />
        {moments.length === 0 &&
            <div style={{ visibility: 'hidden' }}><NewMomentPanel /></div>
        }
    </div>
}

export default MomentPanelContainer