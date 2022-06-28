import '../moment-panel/MomentPanel.css'
import './NewMomentPanel.css'

interface NewMomentPanelProps {
    onClick: Function
}

const NewMomentPanel = ({ onClick }: NewMomentPanelProps) => {
    return <div
        className="moment-panel"
        onClick={() => onClick()}
    >
        <div className='plus'/>
    </div>
}

export default NewMomentPanel