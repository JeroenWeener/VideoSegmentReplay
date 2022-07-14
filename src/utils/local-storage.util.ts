import _ from "lodash"
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
        name: projectName,
        videoId: videoId,
        moments: [],
    }

    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)

    return newProject
}

/**
 * Updates a project in local storage. Returns the updated list of projects from local storage.
 * As projects have no unique identifier, the function requires the old project in addition to the updated one.
 * 
 * @param oldProject the former project
 * @param newProject the updated project
 * @returns the updated list of projects in local storage
 */
export const updateProject = (oldProject: Project, newProject: Project): Project[] => {
    const projects: Project[] = getProjects()
    const updatedProjects = projects.map(p => _.isEqual(p, oldProject) ? newProject : p)
    setProjects(updatedProjects)
    return updatedProjects
}

/**
 * Deletes the provided project from local storage. Returns the updated list of projects from local storage.
 * 
 * @param project the project that should be deleted
 * @returns the updated list of projects from local storage
 */
export const deleteProject = (project: Project): Project[] => {
    const projects: Project[] = getProjects()
    const remainingProjects = projects.filter(p => !_.isEqual(p, project))
    setProjects(remainingProjects)
    return remainingProjects
}