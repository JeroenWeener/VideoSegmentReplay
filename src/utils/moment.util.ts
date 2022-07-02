import { LOG_SAFETY_CHECKS } from "../config"
import { Moment, URLMoment } from "../models/moment.model"

export const secondsToHMSString = (seconds: number, showHours: boolean = false) => {
    const h = Math.floor(seconds / 60 / 60)
    const m = Math.floor(seconds / 60 % 60)
    const s = Math.floor(seconds % 60)
    const mString = h > 0 && m < 10 ? '0' + m : m
    const sString = s >= 10 ? s : '0' + s
    return `${h > 0 || showHours ? `${h}:` : ''}${mString}:${sString}`
}

/**
 * Returns URLMoment from Moment.
 * 
 * @param moment
 * @returns URLMoment
 */
export const toUrlMoment = (moment: Moment): URLMoment => {
    return {
        i: moment.id,
        s: moment.startTime,
        e: moment.endTime,
    }
}

/**
 * Returns Moment from URLMoment.
 * 
 * @param urlMoment
 * @returns Moment
 */
export const fromUrlMoment = (urlMoment: URLMoment): Moment => {
    return {
        id: urlMoment.i,
        startTime: urlMoment.s,
        endTime: urlMoment.e,
    }
}

/**
 * Checks the content of the URLMoment object to detect suspicious properties and values.
 * Since URLMoments are essentially user input (via Projects provided in the url), we need to make sure no malicious code can be inserted into the url (XSS).
 * We check manually if all fields are present in their expected form and whether no unknown fields are added.
 * 
 * @param urlMoment the URLMoment that is inspected
 * @returns whether the URLMoment is considered safe for use
 */
 export const isURLMomentSafe = (urlMoment: URLMoment): boolean => {
    const momentProperties = ['i', 's', 'e']

    const containsOnlyDescribedProperties = Object.keys(urlMoment).every(property => momentProperties.includes(property))

    const idIsNumber = typeof urlMoment.i === 'number'
    const startTimeIsNumber = typeof urlMoment.s === 'number'
    const endTimeIsNumberOrUndefined = typeof urlMoment.e === 'number' || typeof urlMoment.e === 'undefined'

    if (LOG_SAFETY_CHECKS) {
        console.debug('\t--- Moment ---')
        console.debug('\tContains only described properties:', containsOnlyDescribedProperties)
        console.debug('\tID is number:', idIsNumber)
        console.debug('\tStart time is number:', endTimeIsNumberOrUndefined)
        console.debug('\tEnd time is number or undefined:', endTimeIsNumberOrUndefined)
    }

    return (
        containsOnlyDescribedProperties &&
        idIsNumber &&
        startTimeIsNumber &&
        endTimeIsNumberOrUndefined
    )
}