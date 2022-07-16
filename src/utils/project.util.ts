import _ from "lodash"
import { LOG_SAFETY_CHECKS } from "../config"
import { Project, URLProject } from "../models/project.model"
import { fromUrlMoment, isURLMomentSafe, toUrlMoment } from "./moment.util"
import { isValidVideoId } from "./regex.util"

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
export const projectFromBase64 = (encodedString: string): (Project | null) => {
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
 * Returns Project from URLProject.
 * 
 * @param urlProject
 * @returns Project
 */
const fromUrlProject = (urlProject: URLProject): Project => {
    return {
        name: urlProject.n,
        videoId: urlProject.v,
        moments: urlProject.m.map(urlMoment => fromUrlMoment(urlMoment)),
    }
}

/**
 * Estimates* whether two projects are the same.
 * 
 * Since projects do not have an ID, we can only estimate if they are meant to be the same project, but with an update.
 * To assess this, we handle the following criteria:
 * a. projects are different if their video ids are different
 * b. projects are different if **both** their name and moments are different
 * 
 * This means that the app continues to recognize projects when users update a name or the moments.
 * 
 * @param projectA
 * @param projectB
 * @returns whether the projects are estimated to be equal
 */
export const isDifferentProject = (projectA: Project, projectB: Project): boolean => {
    return projectA.videoId !== projectB.videoId ||
        (projectA.name !== projectB.name && _.isEqual(projectA.moments, projectB.moments))
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
