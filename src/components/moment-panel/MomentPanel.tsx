import { Moment } from "../../models/moment.model"

interface MomentPanelProps {
    moment: Moment
}

const MomentPanel = ({ moment }: MomentPanelProps) => {
    return <>
        <div>{moment.id}</div>
        <div>{moment.time}</div>
    </>
}

export default MomentPanel