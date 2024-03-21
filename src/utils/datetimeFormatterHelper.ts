import moment, { utc } from "moment"
import 'moment/locale/sv'

moment.locale('sv')

/**
 * This function convert the Date into a string with the format provided
 * @param date - Date
 * @param format - Date format
 * @returns date string
 */
export const dateFormat = (date: Date, format: string = 'DD-MM-YYYY'): string => {
    return utc(date).local().format(format)
}

/**
 * This function convert a Date into a time string with the format provided
 * @param date - Date
 * @param format - Time format
 * @returns time string
 */
export const timeFormat = (date: Date, format: string = 'HH:mm:ss'): string => {
    return utc(date).local().format(format)
}

/**
 * This function convert a Date into a date time string with the format provided
 * @param date - Date
 * @param format - Date time format
 * @returns date time string
 */
export const datetimeFormat = (date: Date, format: string = 'DD-MM-YYYY HH:mm:ss'): string => {
    return utc(date).local().format(format)
}

/**
 * This function returns the current date time string
 * @param format Date time format
 * @returns date time string
 */
export const nowFormat = (format?: string): string => {
    return utc(new Date()).local().format(format ?? 'DD-MM-YYYY HH:mm:ss')
}