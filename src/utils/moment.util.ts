import { LOG_SAFETY_CHECKS } from "../config"
import { Moment, UnidentifiedMoment, URLMoment } from "../models/moment.model"
import { isValidTrigger } from "./regex.util"

/**
 * Formats seconds to a hh:mm:ss string. Allows for 1 decimal.
 * 
 * Hours are shown when relevant or when explicitly requested by setting showHours to true.
 * 
 * @param seconds the number of seconds that are to be formatted to a hh:mm:ss.s string
 * @returns (hh):(m)m:ss.s string
 */
export const secondsToHMSString = (seconds: number, showHours: boolean = false) => {
    const h = Math.floor(seconds / 60 / 60)
    const m = Math.floor(seconds / 60 % 60)
    const s = Math.ceil((seconds % 60) * 10) / 10
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
        ...(moment.description && { d: moment.description }),
        s: moment.startTime,
        ...(moment.trigger && { t: moment.trigger }),
    }
}

/**
 * Returns UnidentifiedMoment from URLMoment.
 * 
 * @param urlMoment
 * @returns UnIdentifiedMoment
 */
export const fromUrlMoment = (urlMoment: URLMoment): UnidentifiedMoment => {
    return {
        ...(urlMoment.d && { description: urlMoment.d }),
        startTime: urlMoment.s,
        ...(urlMoment.t && { trigger: urlMoment.t })
    }
}

/**
 * Builds a new Moment.
 * 
 * This Moment will not have a trigger.
 * 
 * @param startTime the start time of the moment
 * @returns a new Moment consisting of an ID and a start time
 */
export const buildNewMoment = (startTime: number, description?: string): Moment => {
    return {
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        ...(description && { description: description }),
        startTime: startTime,
    }
}

/**
 * Builds a Moment from an UnidentifiedMoment by adding a random ID.
 * 
 * @param moment a moment without ID
 * @returns the provided moment with an ID
 */
export const buildMoment = (moment: UnidentifiedMoment): Moment => {
    return {
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        ...moment,
    }
}

/**
 * Compares 2 moments.
 * 
 * Moments are equal if:
 * - they have the same ID (if both are of type Moment)
 * - either their start time or their description matches
 * 
 * @param momentA
 * @param momentB
 * @returns whether momentA and momentB are considered equal
 */
export const areEqualMoments = (momentA: Moment | UnidentifiedMoment, momentB: Moment | UnidentifiedMoment): boolean => {
    if ('id' in momentA && 'id' in momentB) {
        return momentA.id === momentB.id
    }

    return momentA.startTime === momentB.startTime || (!!momentA.description && momentA.description === momentB.description)
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
    const momentProperties = ['d', 's', 't']

    const containsOnlyDescribedProperties = Object.keys(urlMoment).every(property => momentProperties.includes(property))

    const descriptionIsUndefinedOrString = !urlMoment.d || typeof urlMoment.d === 'string'

    const startTimeIsNumber = typeof urlMoment.s === 'number'

    const triggerIsUndefinedOrValidChar = !urlMoment.t || isValidTrigger(urlMoment.t)

    if (LOG_SAFETY_CHECKS) {
        console.debug('\t--- Moment ---')
        console.debug('\tContains only described properties:', containsOnlyDescribedProperties)
        console.debug('\tDescription is undefined or string:', descriptionIsUndefinedOrString)
        console.debug('\tStart time is number:', startTimeIsNumber)
        console.debug('\tTrigger is undefined or valid char:', triggerIsUndefinedOrValidChar)
    }

    return (
        containsOnlyDescribedProperties &&
        descriptionIsUndefinedOrString &&
        startTimeIsNumber &&
        triggerIsUndefinedOrValidChar
    )
}

export const momentIdeas = [
    {
        description: 'Verse 2',
    },
    {
        description: 'Impossible piece',
    },
    {
        description: 'Highlight 6',
    },
]