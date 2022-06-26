import { Moment } from "../../models/moment.model"
import './MomentPanel.css'

interface MomentPanelProps {
    moment: Moment
}

const MomentPanel = ({ moment }: MomentPanelProps) => {
    return <div className="moment-panel">
        <div>{moment.time}</div>
    </div>
}

export default MomentPanel