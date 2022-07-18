import _ from "lodash"
import { LOG_SAFETY_CHECKS } from "../config"
import { Project, UnidentifiedProject, URLProject } from "../models/project.model"
import { buildMoment, fromUrlMoment, isURLMomentSafe, toUrlMoment } from "./moment.util"
import { isValidVideoId } from "./regex.util"
import { areEqualMoments } from "./moment.util"

/**
 * Returns the provided project as URLProject in Base64 encoding.
 * 
 * @param project the project to encode
 * @returns the Base64 encoding of the provided project as URLProject
 */
export const projectToBase64 = (project: Project): string => {
    const urlProject: URLProject = toUrlProject(project)
    const jsonString: string = JSON.stringify(urlProject)
    // Remove quotes from property names
    const strippedJsonString: string = jsonString.replaceAll(/"([a-z])":/g, "$1:")
    return window.btoa(strippedJsonString)
}

/**
 * Returns a project from a Base64 encoding of a URLProject or null if the encoding is faulty in any way.
 * 
 * @param encodedString the supposed Base64 encoded URLProject
 * @returns the encoded project, or null if the encoding is faulty in any way
 */
export const projectFromBase64 = (encodedString: string): UnidentifiedProject | null => {
    try {
        const strippedJsonString: string = window.atob(encodedString)
        // Restore quotes round property names
        const jsonString: string = strippedJsonString.replaceAll(/([a-z]):/g, "\"$1\":")
        const urlProject: URLProject = JSON.parse(jsonString)
        return isURLProjectSafe(urlProject) ? fromUrlProject(urlProject) : null
    } catch {
        return null
    }
}

/**
 * Returns URLProject from Project.
 * 
 * @param project
 * @returns URLProject
 */
const toUrlProject = (project: Project): URLProject => {
    return {
        n: project.name,
        v: project.videoId,
        m: project.moments.map(moment => toUrlMoment(moment)),
    }
}

/**
 * Returns UnidentifiedProject from URLProject.
 * 
 * @param urlProject
 * @returns UnidentifiedProject
 */
const fromUrlProject = (urlProject: URLProject): UnidentifiedProject => {
    return {
        name: urlProject.n,
        videoId: urlProject.v,
        moments: urlProject.m.map(urlMoment => fromUrlMoment(urlMoment)),
    }
}

/**
 * Builds a new Project.
 * 
 * @param projectName the name of the project
 * @param videoId the id of the video associated with the project
 * @returns a new Project
 */
export const buildNewProject = (projectName: string, videoId: string): Project => {
    return {
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        name: projectName,
        videoId: videoId,
        moments: [],
    }
}

/**
 * Builds a Project from an UnidentifiedProject by adding a random ID.
 * 
 * @param project a project without ID
 * @returns the provided project with an ID
 */
export const buildProject = (project: UnidentifiedProject): Project => {
    return {
        ...project,
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        moments: project.moments.map(m => buildMoment(m)),
    }
}

/**
 * Compares 2 projects.
 * 
 * Projects are equal if:
 * - they have the same ID (if both are of type Project)
 * - they have the same videoID AND
 *   - they have the same name OR their moments are considered equal
 * 
 * @param projectA
 * @param projectB
 * @returns whether projectA and projectB are considered equal
 */
export const areEqualProjects = (projectA: Project | UnidentifiedProject, projectB: Project | UnidentifiedProject): boolean => {
    if ('id' in projectA && 'id' in projectB) {
        return projectA.id === projectB.id
    }

    if (projectA.videoId !== projectB.videoId) {
        return false
    }

    const sameName = projectA.name === projectB.name
    const sameNumberOfMoments = projectA.moments.length === projectB.moments.length
    const sameMoments = sameNumberOfMoments && _.zip(projectA.moments, projectB.moments).every(([ma, mb]) => areEqualMoments(ma!, mb!))

    return sameName || sameMoments
}

/**
 * Sorts projects by name. If projects have equal names, sort according to video id.
 * 
 * @param projects
 * @returns projects, sorted
 */
export const sortProjects = (projects: Project[]): Project[] => {
    return projects.sort((projectA, projectB) => {
        const nameComparison = projectA.name.localeCompare(projectB.name)
        if (nameComparison === 0) {
            return projectA.videoId.localeCompare(projectB.videoId)
        }
        return nameComparison
    })
}

/**
 * Checks the content of the URLProject object to detect suspicious properties and values.
 * Since URLProjects are essentially user input, we need to make sure no malicious code can be inserted into them.
 * We check manually if all fields are present in their expected form and whether no unknown fields are added.
 * 
 * @param urlProject the project that is inspected
 * @returns whether the project is considered safe for use
 */
const isURLProjectSafe = (urlProject: URLProject): boolean => {
    const projectProperties = ['n', 'v', 'm']

    const containsOnlyDescribedProperties = Object.keys(urlProject).every(property => projectProperties.includes(property))

    const videoIdIsValid = isValidVideoId(urlProject.v)
    const nameIsString = typeof urlProject.n === 'string'

    if (LOG_SAFETY_CHECKS) {
        console.debug('--- Project ---')
        console.debug('Contains only described properties:', containsOnlyDescribedProperties)
        console.debug('Video ID is valid', videoIdIsValid)
        console.debug('Name is string:', nameIsString)
    }

    const momentsIsArray = Array.isArray(urlProject.m)
    const momentsAreSafe = urlProject.m.every(moment => isURLMomentSafe(moment))
    const triggers = urlProject.m.map(moment => moment.t).filter(t => t)
    const momentsContainUniqueTriggers = new Set(triggers).size === triggers.length

    if (LOG_SAFETY_CHECKS) {
        console.debug('Moments is array:', momentsIsArray)
        console.debug('Moments are safe:', momentsAreSafe)
        console.debug('Moments contain unique triggers:', momentsContainUniqueTriggers)
    }

    return (
        containsOnlyDescribedProperties &&
        videoIdIsValid &&
        nameIsString &&
        momentsIsArray &&
        momentsAreSafe &&
        momentsContainUniqueTriggers
    )
}

export const projectIdeas = [
    {
        name: 'Call me maybe - Carly Rae Jepsen',
        videoUrl: 'https://www.youtube.com/watch?v=fWNaR-rxAic',
    },
    {
        name: 'Jumpstyle 180 how-to',
        videoUrl: 'https://www.youtube.com/watch?v=WqNlBjtueig',
    },
    {
        name: 'Piano tutorial Let it Go',
        videoUrl: 'https://www.youtube.com/watch?v=4Kh3IvMD4xE',
    },
]