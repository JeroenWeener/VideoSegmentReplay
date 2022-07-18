import { Moment } from "../models/moment.model"
import { Project, UnidentifiedProject } from "../models/project.model"
import { buildMoment } from "./moment.util"
import { areEqualProjects, buildProject } from "./project.util"

const PROJECTS = 'projects'

/**
 * Retrieves the projects from storage.
 * 
 * @returns the projects in storage
 */
export const getProjectsFromStorage = (): Project[] => {
    const projectsJSON = localStorage.getItem(PROJECTS)
    return projectsJSON ? JSON.parse(projectsJSON) : []
}

/**
 * Overwrites the projects in storage
 * 
 * @param projects the projects
 */
export const setProjectsInStorage = (projects: Project[]): void => {
    localStorage.setItem(PROJECTS, JSON.stringify(projects))
}

/**
 * Adds project to local storage if it is new or updates it if it is already there.
 * 
 * If the project is new, but its name is already taken, the name is appended with '(#)'.
 * 
 * @param project the project to add
 * @returns the new or updated project
 */
export const addProjectToStorage = (project: UnidentifiedProject): Project => {
    const projects: Project[] = getProjectsFromStorage()

    const existingProject: Project | undefined = projects.find(p => areEqualProjects(p, project))

    if (!existingProject) {
        const projectName = calculateProjectName(project.name, projects.map(p => p.name))

        const newProject = { ...buildProject(project), name: projectName }
        setProjectsInStorage([...projects, newProject])
        return newProject
    }

    const updatedMoments: Moment[] = project.moments.map(m => buildMoment(m))
    const updatedProject: Project = { ...existingProject, ...project, moments: updatedMoments }
    const otherProjects: Project[] = projects.filter(p => !areEqualProjects(p, existingProject))
    setProjectsInStorage([...otherProjects, updatedProject])
    return updatedProject
}

/**
 * Calculates the name for a project. This will be the original name, unless it is already taken.
 * Then, it will append '(#)' to the name with # the lowest number to make the number unique.
 * 
 * @param originalName the desired name of the project
 * @param existingProjectNames the names of all other projects
 * @returns originalName or originalName + '(#)'
 */
const calculateProjectName = (originalName: string, existingProjectNames: string[]): string => {
    let counter = 0
    let projectName

    const updateName = (name: string) => counter++ === 0 ? name : `${name} (${counter - 1})`
    const isProjectNameTaken = (name: string) => existingProjectNames.includes(name)

    do {
        projectName = updateName(originalName)
    } while (isProjectNameTaken(projectName))

    return projectName
}

/**
 * Updates a project in local storage. Returns the updated list of projects from local storage.
 * 
 * @param newProject the updated project
 * @returns the updated list of projects in local storage
 */
export const updateProjectInStorage = (newProject: Project): Project[] => {
    const projects: Project[] = getProjectsFromStorage()
    const updatedProjects = projects.map(p => p.id === newProject.id ? newProject : p)
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
    const remainingProjects = projects.filter(p => p.id !== project.id)
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