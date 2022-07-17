import panelStyles from '../moment-panel/MomentPanel.module.scss'
import styles from './NewMomentPanel.module.scss'

interface NewMomentPanelProps {
    onClick: () => void
}

const NewMomentPanel = ({ onClick }: NewMomentPanelProps) => {
    return <div
        className={panelStyles.momentPanel}
        onClick={onClick}
    >
        <div className={styles.plus} />
    </div>
}

export default NewMomentPanel