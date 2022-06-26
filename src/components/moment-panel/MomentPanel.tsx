import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import './MomentPanel.css'

interface MomentPanelProps {
    moment: Moment
    onClick: Function
}

const MomentPanel = ({ moment, onClick }: MomentPanelProps) => {
    return <div
        className="moment-panel"
        onClick={() => onClick()}
    >
        <div className='time'>{secondsToHMSString(moment.time)}</div>
    </div>
}

export default MomentPanel