import _ from "lodash"
import { Project } from "../models/project.model"

const PROJECTS = 'projects'

export const getProjectsFromStorage = (): Project[] => {
    const projectsJSON = localStorage.getItem(PROJECTS)
    return projectsJSON ? JSON.parse(projectsJSON) : []
}

export const setProjectsInStorage = (projects: Project[]): void => {
    localStorage.setItem(PROJECTS, JSON.stringify(projects))
}

/**
 * Creates new project and stores it in local storage. Returns the new project.
 * 
 * @param projectName the name of the project
 * @param videoId the YouTube video ID of the video of the project
 * @returns the created project
 */
export const createProjectInStorage = (projectName: string, videoId: string): Project => {
    const projects: Project[] = getProjectsFromStorage()
    const newProject = {
        name: projectName,
        videoId: videoId,
        moments: [],
    }

    const updatedProjects = [...projects, newProject]
    setProjectsInStorage(updatedProjects)

    return newProject
}

/**
 * Adds project to local storage if it is new.
 * 
 * @param project the project to add
 * @returns the project
 */
export const addProjectToStorage = (project: Project): Project => {
    const projects: Project[] = getProjectsFromStorage()
    const isProjectNew = projects.find((p) => _.isEqual(p, project)) === undefined
    let updatedProjects = projects
    if (isProjectNew) {
        updatedProjects.push(project)
    }
    setProjectsInStorage(updatedProjects)
    return project
}

/**
 * Updates a project in local storage. Returns the updated list of projects from local storage.
 * As projects have no unique identifier, the function requires the old project in addition to the updated one.
 * 
 * @param oldProject the former project
 * @param newProject the updated project
 * @returns the updated list of projects in local storage
 */
export const updateProjectInStorage = (oldProject: Project, newProject: Project): Project[] => {
    const projects: Project[] = getProjectsFromStorage()
    const updatedProjects = projects.map(p => _.isEqual(p, oldProject) ? newProject : p)
    setProjectsInStorage(updatedProjects)
    return updatedProjects
}

/**
 * Deletes the provided project from local storage. Returns the updated list of projects from local storage.
 * 
 * @param project the project that should be deleted
 * @returns the updated list of projects from local storage
 */
export const deleteProjectFromStorage = (project: Project): Project[] => {
    const projects: Project[] = getProjectsFromStorage()
    const remainingProjects = projects.filter(p => !_.isEqual(p, project))
    setProjectsInStorage(remainingProjects)
    return remainingProjects
}

const VOLUME = 'volume'

/**
 * Store app volume in local storage.
 * Volume is rounded to the nearest integer and clipped between 0-100.
 * 
 * @param volume the volume of the app that is to be stored
 * @returns the final volume value
 */
export const storeVolume = (volume: number): number => {
    let v = Math.round(volume)
    v = v < 0 ? 0 : v
    v = v > 100 ? 100 : v
    localStorage.setItem(VOLUME, '' + v)
    return v
}

/**
 * Retrieve app volume from local storage or 100 if it is not set.
 * 
 * @returns the app volume
 */
export const retrieveVolume = (): number => {
    return +(localStorage.getItem(VOLUME) || 100)
}