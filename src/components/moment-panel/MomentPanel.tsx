import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import './MomentPanel.css'

interface MomentPanelProps {
    currentTime: number
    moment: Moment
    onStart: Function
    onDelete: Function
}

const MomentPanel = ({
    currentTime,
    moment,
    onStart,
    onDelete,
}: MomentPanelProps) => {
    let progress = 100 * (currentTime - moment.startTime) / (moment.endTime! - moment.startTime)
    progress = progress < 0 ? 0 : progress
    progress = progress > 100 ? 100 : progress

    return <div
        className="moment-panel"
        onClick={() => onStart()}
    >
        <div className="button-delete" onClick={() => onDelete()}/>
        <div className='time'>{secondsToHMSString(moment.startTime)}</div>

        <div
            className="progress-indicator"
            style={{ backgroundImage: `conic-gradient(red ${progress}%, transparent 0)` }}
        ></div>
    </div>
}

export default MomentPanel