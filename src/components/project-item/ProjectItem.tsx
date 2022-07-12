import { Project } from "../../models/project.model"
import './ProjectItem.css'

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
    return <div className="project-row">
        <span className="label-project-name" onClick={onSelect}>{project.name}</span>
        <button className="button-project-delete" onClick={onDelete} />
    </div>
}

export default ProjectItem