import { createWriteStream, existsSync, mkdirSync, WriteStream } from "fs"
import { error } from "../constants/constants"
import { dateFormat } from "./datetimeFormatterHelper"

/**
 * This function creates a new log file if the date has changed
 * @param date - Date
 * @param logFile - Write stream
 * @returns new write stream
 */
export const newLogFile = (date: Date, logFile?: WriteStream) => {
    try {
        if (logFile != null) {
            logFile.close()
        }

        const dateString = dateFormat(date, 'YYYY-MM-DD')

        console.log(getDirname())

        const dirname = getDirname() + '/logs'
        console.log(dirname)
        if (!existsSync(dirname)) {
            mkdirSync(dirname)
        }

        const path = dirname + '/gateway_' + dateString + '.log'
        logFile = createWriteStream(path, { flags: 'a' })
        return logFile
    } catch (ex) {
        console.log(error(), "[Gateway:newLogFile] ex= " + ex)
    }
}

/**
 * This function gets the project path base directory
 * @returns directory name
 */
export const getDirname = () => {
    const dir = __dirname.split('/')
    dir.splice(dir.length - 2)

    let dirname = ''
    dir.map(value => {
        dirname = dirname.concat(value, '/')
    })

    return dirname
}