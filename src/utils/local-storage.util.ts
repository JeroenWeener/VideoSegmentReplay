import { Project } from "../models/project.model"

const PROJECTS = 'projects'

export const getProjects = () => {
    const projectsJSON = localStorage.getItem(PROJECTS)
    return projectsJSON ? JSON.parse(projectsJSON) : []
}

export const setProjects = (projects: Project[]) => {
    localStorage.setItem(PROJECTS, JSON.stringify(projects))
}

export const addProject = (projectName: string, videoId: string) => {
    const projects: Project[] = getProjects()
    const newProject = {
        id: Math.max(...projects.map(project => project.id)) + 1,
        name: projectName,
        videoId: videoId,
        moments: [],
    }
    
    let updatedProjects
    if (projects) {
        updatedProjects = [...projects, newProject]
    } else {
        updatedProjects = [newProject]
    }

    setProjects(updatedProjects)
}

export const updateProject = (project: Project) => {
    const projects: Project[] = getProjects()
    const updatedProjects = projects.map(p => p.id === project.id ? project : p)
    setProjects(updatedProjects)
}

export const deleteProject = (project: Project) => {
    const projects: Project[] = getProjects()
    const updatedProjects = projects.filter(p => p.id !== project.id)
    setProjects(updatedProjects)
}