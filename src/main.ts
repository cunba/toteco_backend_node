import { WriteStream } from "fs"
import { stdout } from "process"
import { format } from "util"
import { apiClient } from "./clients/apiClient"
import { databaseClient } from "./clients/databaseClient"
import { error } from "./constants/constants"
import { dateFormat, datetimeFormat } from "./utils/datetimeFormatterHelper"
import { newLogFile } from "./utils/logger"

let startDate = new Date()
let logFile: WriteStream | undefined = newLogFile(startDate)
const ansiChars = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

/**
 * This function writes the logs from the project into the console and into a log file
 * @param args strings
 */
console.log = function (...args) {
    let currentDate = new Date()

    if (dateFormat(startDate) !== dateFormat(currentDate)) {
        logFile = newLogFile(currentDate, logFile);
        startDate = currentDate
    }

    if (logFile) {
        logFile.write(datetimeFormat(currentDate) + '\t\t' + format.apply(this, args).replace(ansiChars, '') + '\n');
        stdout.write(datetimeFormat(currentDate) + '\t' + format.apply(this, args) + '\n');
    }
}

console.log('*******************************************************************************************************************')
console.log('******************************      TOTECO logger ' + new Date().toUTCString() + '      ******************************')
console.log('*******************************************************************************************************************')

apiClient()
databaseClient()

// to log all bugs that occured in synchronus code but not handlled anywhere
process.on('uncaughtException', err => {
    console.log(error(), 'Uncaught exception', err.name, err.message);
    console.log('\t\t', err.stack)
    // process.exit(1);
});

// to log all unhandledRejection in you APP (Async Code)
process.on('unhandledRejection', (err: any) => {
    console.log(error(), 'Unhandled rejection', err.name, err.message);
    console.log('\t\t', err.stack)
    // process.exit(1); // 0 for success & 1 for uncaught exeptions
});