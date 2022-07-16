import { LOG_SAFETY_CHECKS } from "../config"
import { Moment, URLMoment } from "../models/moment.model"
import { isValidTrigger } from "./regex.util"

/**
 * Formats seconds to a hh:mm:ss string.
 * 
 * Hours are shown when relevant or when explicitly requested by setting showHours to true.
 * 
 * @param seconds the number of seconds that are to be formatted to a hh:mm:ss string
 * @returns (hh):(m)m:ss string
 */
export const secondsToHMSString = (seconds: number, showHours: boolean = false) => {
    const h = Math.floor(seconds / 60 / 60)
    const m = Math.floor(seconds / 60 % 60)
    const s = Math.ceil(seconds % 60)
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
        s: moment.startTime,
        ...(moment.trigger && { t: moment.trigger }),
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
        startTime: urlMoment.s,
        ...(urlMoment.t && { trigger: urlMoment.t })
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
    const momentProperties = ['s', 't']

    const containsOnlyDescribedProperties = Object.keys(urlMoment).every(property => momentProperties.includes(property))

    const startTimeIsNumber = typeof urlMoment.s === 'number'

    const triggerIsUndefinedOrValidChar = !urlMoment.t || isValidTrigger(urlMoment.t)

    if (LOG_SAFETY_CHECKS) {
        console.debug('\t--- Moment ---')
        console.debug('\tContains only described properties:', containsOnlyDescribedProperties)
        console.debug('\tStart time is number:', startTimeIsNumber)
        console.debug('\tTrigger is undefined or valid char:', triggerIsUndefinedOrValidChar)
    }

    return (
        containsOnlyDescribedProperties &&
        startTimeIsNumber &&
        triggerIsUndefinedOrValidChar
    )
}