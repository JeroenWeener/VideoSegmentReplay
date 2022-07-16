import _ from "lodash"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Project } from "../../models/project.model"
import CurrentProjectService from "../../services/current-project-service"
import { projectToBase64 } from "../../utils/project.util"
import './ProjectDropdown.css'

const currentProjectService = CurrentProjectService.getInstance()

interface ProjectDropdownProps {
    projects: Project[]
}

const ProjectDropdown = ({
    projects,
}: ProjectDropdownProps) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)
    
    const currentProject = currentProjectService.getCurrentProject()
    const sortedProjects = currentProject ? [currentProject, ...projects.filter(p => !_.isEqual(p, currentProject))] : projects

    const openProject = (project: Project): void => {
        navigate(`/project/${projectToBase64(project)}`)
    }

    return <>
        {currentProject && <div
            className={`${open ? 'opened' : ''} dropdown-projects`}
            onClick={() => setOpen(e => !e)}
        >
            {sortedProjects.map((project, index) => <div
                key={index}
                className='dropdown-option-projects'
                onClick={() => index !== 0 && openProject(project)}
            >
                {project.name}
            </div>)}
        </div>}
    </>
}

export default ProjectDropdown