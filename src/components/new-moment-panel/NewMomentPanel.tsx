import '../moment-panel/MomentPanel.css'
import './NewMomentPanel.css'

interface NewMomentPanelProps {
    onClick: () => void
}

const NewMomentPanel = ({ onClick }: NewMomentPanelProps) => {
    return <div
        className="moment-panel new-moment-panel"
        onClick={onClick}
    >
        <div className='plus' />
    </div>
}

export default NewMomentPanel