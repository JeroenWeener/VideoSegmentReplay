export interface Moment {
    id: number
    startTime: number
    endTime?: number
}

/**
 * Moment as stored in the URL, featuring shorter field names, to preserve space.
 */
 export interface URLMoment {
    i: number
    s: number
    e?: number
}