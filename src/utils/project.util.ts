import { Project } from "../models/project.model";

/**
 * Returns the provided project in Base64 encoding.
 * 
 * @param project the project to encode
 * @returns the Base64 encoding of the provided project
 */
export const projectToBase64 = (project: Project): string => {
    return window.btoa(JSON.stringify(project));
}

/**
 * Returns a project from a Base64 encoding or null if the encoding is faulty in any way.
 * 
 * @param encodedString the supposed Base64 encoded project
 * @returns the encoded project, or null if the encoding is faulty in any way
 */
export const projectFromBase64 = (encodedString: string): (Project | null) => {
    try {
        return JSON.parse(window.atob(encodedString))
    } catch {
        return null
    }
}