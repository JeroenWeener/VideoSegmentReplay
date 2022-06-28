import { Project } from "../models/project.model"

const PROJECTS = 'projects'

export const getProjects = (): Project[] => {
    const projectsJSON = localStorage.getItem(PROJECTS)
    return projectsJSON ? JSON.parse(projectsJSON) : []
}

export const setProjects = (projects: Project[]): void => {
    localStorage.setItem(PROJECTS, JSON.stringify(projects))
}

/**
 * Creates new project and stores it in local storage. Returns the new project.
 * 
 * @param projectName the name of the project
 * @param videoId the YouTube video ID of the video of the project
 * @returns the created project
 */
export const addProject = (projectName: string, videoId: string): Project => {
    const projects: Project[] = getProjects()
    const newProject = {
        id: Math.max(...projects.map(project => project.id)) + 1,
        name: projectName,
        videoId: videoId,
        moments: [],
    }
    
    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)

    return newProject
}

/**
 * Updates the provided project in local storage. Returns the updated list of projects from local storage.
 * 
 * @param project the updated project
 * @returns the updated list of projects in local storage
 */
export const updateProject = (project: Project): Project[] => {
    const projects: Project[] = getProjects()
    const updatedProjects = projects.map(p => p.id === project.id ? project : p)
    setProjects(updatedProjects)
    return updatedProjects
}

/**
 * Deletes the provided project from local storage. Returns the updated list of projects from local storage.
 * 
 * @param projectId the ID of the project that should be deleted
 * @returns the updated list of projects from local storage
 */
export const deleteProject = (projectId: number): Project[] => {
    const projects: Project[] = getProjects()
    const updatedProjects = projects.filter(p => p.id !== projectId)
    setProjects(updatedProjects)
    return updatedProjects
}