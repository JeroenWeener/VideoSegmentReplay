export interface Moment {
    startTime: number
    endTime?: number
}

/**
 * Moment as stored in the URL, featuring shorter field names, to preserve space.
 */
 export interface URLMoment {
    s: number
    e?: number
}