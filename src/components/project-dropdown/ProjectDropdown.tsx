import _ from "lodash"
import { useEffect, useState } from "react"
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
    const [projectList, setProjectList] = useState<Project[]>(projects)

    const currentProject = currentProjectService.getCurrentProject()

    useEffect(() => {
        const sortedProjects = projects.sort((a, b) => a.name.localeCompare(b.name))
        setProjectList(currentProject ? [currentProject, ...sortedProjects.filter(p => !_.isEqual(p, currentProject))] : sortedProjects)
    }, [currentProject, projects])

    useEffect(() => {
        if (!open) return

        const handleClickOutside = (e: MouseEvent) => {
            const container = document.getElementById('dropdown-projects-container')
            if (container && !container.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const handleEsc = (e: KeyboardEvent) => {
            if (
                e.key === 'Escape' ||
                e.code === 'Escape' ||
                e.keyCode === 27
            ) {
                setOpen(false)
            }
        }

        window.addEventListener('click', handleClickOutside)
        window.addEventListener('keyup', handleEsc)
        return () => {
            window.removeEventListener('click', handleClickOutside)
            window.removeEventListener('keyup', handleEsc)
        }
    }, [currentProject, open])

    const openProject = (project: Project): void => {
        navigate(`/project/${projectToBase64(project)}`)
    }

    return <>
        {currentProject && <div
            id="dropdown-projects-container"
            className={`${open ? 'opened' : ''} dropdown-projects`}
            onClick={() => setOpen(e => !e)}
        >
            {projectList.map((project, index) => <div
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