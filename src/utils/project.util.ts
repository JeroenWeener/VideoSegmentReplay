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
    return window.btoa(JSON.stringify(toUrlProject(project)))
}

/**
 * Returns a project from a Base64 encoding of a URLProject or null if the encoding is faulty in any way.
 * 
 * @param encodedString the supposed Base64 encoded URLProject
 * @returns the encoded project, or null if the encoding is faulty in any way
 */
export const projectFromBase64 = (encodedString: string): (Project | null) => {
    try {
        const urlProject: URLProject = JSON.parse(window.atob(encodedString))
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
        i: project.id,
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
        id: urlProject.i,
        name: urlProject.n,
        videoId: urlProject.v,
        moments: urlProject.m.map(urlMoment => fromUrlMoment(urlMoment)),
    }
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
    const projectProperties = ['i', 'n', 'v', 'm']

    const containsOnlyDescribedProperties = Object.keys(urlProject).every(property => projectProperties.includes(property))

    const idIsNumber = typeof urlProject.i === 'number'
    const videoIdIsValid = isValidVideoId(urlProject.v)
    const nameIsString = typeof urlProject.n === 'string'
    const momentsIsArray = Array.isArray(urlProject.m)
    const momentsAreSafe = urlProject.m.every(moment => isURLMomentSafe(moment))

    return (
        containsOnlyDescribedProperties &&
        idIsNumber &&
        videoIdIsValid &&
        nameIsString &&
        momentsIsArray &&
        momentsAreSafe
    )
}
