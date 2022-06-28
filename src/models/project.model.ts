import { Moment, URLMoment } from "./moment.model"

export interface Project {
    id: number
    name: string
    videoId: string
    moments: Moment[]
}

/**
 * Project as stored in the URL, featuring shorter field names, to preserve space.
 */
export interface URLProject {
    i: number
    n: string
    v: string
    m: URLMoment[]
}