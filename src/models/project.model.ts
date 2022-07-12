import { Moment, URLMoment } from "./moment.model"

export interface Project {
    name: string
    videoId: string
    moments: Moment[]
}

/**
 * Project as stored in the URL, featuring shorter field names, to preserve space.
 */
export interface URLProject {
    n: string
    v: string
    m: URLMoment[]
}