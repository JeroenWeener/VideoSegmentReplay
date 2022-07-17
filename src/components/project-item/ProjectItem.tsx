import { Project } from "../../models/project.model"
import styles from './ProjectItem.module.scss'

interface ProjectItemProps {
    project: Project
    onSelect: () => void
    onDelete: () => void
}

const ProjectItem = ({
    project,
    onSelect,
    onDelete,
}: ProjectItemProps) => {
    return <div className={styles.projectRow}>
        <span className={styles.labelProjectName} onClick={onSelect}>{project.name}</span>
        <button className={styles.buttonProjectDelete} onClick={onDelete} />
    </div>
}

export default ProjectItem