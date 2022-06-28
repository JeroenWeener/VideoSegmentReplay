import { Moment } from "../models/moment.model"
import { Project } from "../models/project.model"
import { isValidVideoId } from "./regex.util"

/**
 * Returns the provided project in Base64 encoding.
 * 
 * @param project the project to encode
 * @returns the Base64 encoding of the provided project
 */
export const projectToBase64 = (project: Project): string => {
    return window.btoa(JSON.stringify(project))
}

/**
 * Returns a project from a Base64 encoding or null if the encoding is faulty in any way.
 * 
 * @param encodedString the supposed Base64 encoded project
 * @returns the encoded project, or null if the encoding is faulty in any way
 */
export const projectFromBase64 = (encodedString: string): (Project | null) => {
    try {
        const project = JSON.parse(window.atob(encodedString))
        return isProjectSafe(project) ? project : null
    } catch {
        return null
    }
}

/**
 * Checks the content of the Project object to detect suspicious properties and values.
 * Since Projects are essentially user input (url), we need to make sure no malicious code can be inserted into the url (XSS).
 * We check manually if all fields are present in their expected form and whether no unknown fields are added.
 * 
 * @param project the project that is inspected
 * @returns whether the project is considered safe for use
 */
const isProjectSafe = (project: Project): boolean => {
    const projectProperties = ['id', 'name', 'videoId', 'moments']

    const containsOnlyDescribedProperties = Object.keys(project).every(property => projectProperties.includes(property))

    const idIsNumber = typeof project.id === 'number'
    const videoIdIsValid = isValidVideoId(project.videoId)
    const nameIsString = typeof project.name === 'string'
    const momentsIsArray = Array.isArray(project.moments)
    const momentsAreSafe = project.moments.every(moment => isMomentSafe(moment))

    return (
        containsOnlyDescribedProperties &&
        idIsNumber &&
        videoIdIsValid &&
        nameIsString &&
        momentsIsArray &&
        momentsAreSafe
    )
}

/**
 * Checks the content of the Moment object to detect suspicious properties and values.
 * Since Moments are essentially user input (via Projects provided in the url), we need to make sure no malicious code can be inserted into the url (XSS).
 * We check manually if all fields are present in their expected form and whether no unknown fields are added.
 * 
 * @param moment the moment that is inspected
 * @returns whether the moment is considered safe for use
 */
const isMomentSafe = (moment: Moment): boolean => {
    const momentProperties = ['time']

    const containsOnlyDescribedProperties = Object.keys(moment).every(property => momentProperties.includes(property))

    const timeIsNumber = typeof moment.time === 'number'

    return (
        containsOnlyDescribedProperties &&
        timeIsNumber
    )
}
