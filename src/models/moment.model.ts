/**
 * Basic Moment interface, representing a point in time in a video.
 */
export interface Moment {
    id: number
    startTime: number
    trigger?: string
}

/**
 * A Moment that has yet to receive an id.
 */
export type UnidentifiedMoment = Omit<Moment, 'id'>

/**
 * Moment as stored in the URL, featuring shorter field names, to preserve space.
 */
 export interface URLMoment {
    s: number
    t?: string
}