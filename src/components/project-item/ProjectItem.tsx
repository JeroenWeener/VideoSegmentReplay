import { Project } from "../../models/project.model"
import './ProjectItem.css'

interface ProjectItemProps {
    project: Project
    onDelete: () => void
}

const ProjectItem = ({
    project,
    onDelete,
}: ProjectItemProps) => {
    return <div className="project-row">
        <span className="label-project-name">{project.name}</span>
        <button className="button-project-delete" onClick={onDelete} />
    </div>
}

export default ProjectItem