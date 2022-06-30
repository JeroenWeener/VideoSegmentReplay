import { Moment } from "../../models/moment.model"
import { secondsToHMSString } from "../../utils/moment.util"
import './MomentPanel.css'

interface MomentPanelProps {
    currentTime: number
    moment: Moment
    onClick: Function
}

const MomentPanel = ({
    currentTime,
    moment,
    onClick,
}: MomentPanelProps) => {
    return <div
        className="moment-panel"
        onClick={() => onClick()}
    >
        <div className='time'>{secondsToHMSString(moment.startTime)}</div>

        <div className="loading-indicator-wrapper">
            <div className='loading-indicator'>
                <div className='hold left'>
                    <div className='fill'></div>
                </div>
                <div className='hold right'>
                    <div className='fill'></div>
                </div>
            </div>
        </div>
    </div>
}

export default MomentPanel