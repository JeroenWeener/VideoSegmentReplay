import { Project } from "../../models/project.model"

interface ProjectItemProps {
    project: Project
    onDelete: () => void
}

const ProjectItem = ({
    project,
    onDelete,
}: ProjectItemProps) => {
    return <>
        <span>{project.name}</span>
        <button onClick={onDelete}>X</button>
    </>
}

export default ProjectItem