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
    const progress = (currentTime - moment.startTime) / (moment.endTime! - moment.startTime)
    let degrees = progress * 360
    degrees = degrees < 0 ? 0 : degrees
    degrees = degrees > 360 ? 360 : degrees
    const leftDegrees = progress >= .5 ? 180 : degrees
    const rightDegrees = progress < .5 ? 0 : degrees - 180

    const movingForward = progress >= .5

    return <div
        className="moment-panel"
        onClick={() => onClick()}
    >
        <div className='time'>{secondsToHMSString(moment.startTime)}</div>

        <div className="loading-indicator-wrapper">
            <div className='loading-indicator'>
                <div className='hold left'>
                    <div className='fill' style={{
                        transform: `rotate(${leftDegrees}deg)`,
                        // transitionDelay: `${movingForward? 0 : .2}s`,
                    }} />
                </div>
                <div className='hold right'>
                    <div className='fill' style={{
                        transform: `rotate(${rightDegrees}deg)`,
                        // transitionDelay: `${movingForward? .2 : 0}s`,
                    }} />
                </div>
            </div>
        </div>
    </div>
}

export default MomentPanel

// Zelf animatie uitrekenen? Target value geven, setInterval(() => {}, 1000 / 60)