export interface Moment {
    startTime: number
    trigger?: string
}

/**
 * Moment as stored in the URL, featuring shorter field names, to preserve space.
 */
 export interface URLMoment {
    s: number
    t?: string
}