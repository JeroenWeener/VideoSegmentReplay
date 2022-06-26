import { Moment } from "../../models/moment.model"
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
        <div>{moment.time}</div>
    </div>
}

export default MomentPanel