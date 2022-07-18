import { Moment, UnidentifiedMoment, URLMoment } from "./moment.model"

/**
 * Basic Project interface.
 */
export interface Project {
    id: number
    name: string
    videoId: string
    moments: Moment[]
}

/**
 * A Project that has yet to receive ids for the project itself and its moments.
 */
export interface UnidentifiedProject {
    name: string
    videoId: string
    moments: UnidentifiedMoment[]
}

/**
 * Project as stored in the URL, featuring shorter field names, to preserve space.
 */
export interface URLProject {
    n: string
    v: string
    m: URLMoment[]
}