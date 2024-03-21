/**
 * This function creates a delay of the miliseconds provided
 * @param miliseconds - Miliseconds
 * @returns delay
 */
export const delay = (miliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

/**
 * This function creates a delay of the miliseconds provided and throw a callback when the delay finish
 * @param miliseconds - Miliseconds
 * @param callbackFunction - Callback function
 * @param callbackFunctionParameter - Callback function parameter
 */
export const wait = async (miliseconds: number, callbackFunction: Function, callbackFunctionParameter: any) => {
    await delay(miliseconds).then(() => callbackFunction(callbackFunctionParameter))
}

/**
 * This function creates an url base on the configuration provided
 * @param protocol - Protocol (http, https, mqtt, wss, ws...)
 * @param host - Host
 * @param port - Port
 * @param domain - Domain or undefined
 * @returns url
 */
export const apiUrl = (protocol: string, host: string, port: number, domain?: string) => {
    let url = protocol + '://' + host + ':' + port

    if (domain) {
        return url + '/' + domain
    }

    return url
}

/**
 * This function find the topic name of the topic provided
 * @param topic - Topic
 * @param separator - Topic separator 
 * @returns topic name
 */
export const findTopicName = (topic: string, separator: string) => {
    const topicNames = topic.split(separator)
    for (let i = topicNames.length - 1; i > 0; i--) {
        if (topicNames[i] !== '+' && topicNames[i] !== '#') {
            return topicNames[i]
        }
    }
}

/**
 * This function orders from lowest to highest timestamp an array of store transport order information data
 * @param a - Store transport order information data
 * @param b - Store transport order information data
 * @returns number
 */
export const orderAsc = (a: any, b: any) => {
    if (a.timestamp! < b.timestamp!) {
        return -1
    } else if (a.timestamp! > b.timestamp!) {
        return 1
    } else {
        return 0
    }
    // }
}

/**
 * This function orders from highest to lowest timestamp an array of store transport order information data
 * @param a - Store transport order information data
 * @param b - Store transport order information data
 * @returns number
 */
export const orderDesc = (a: any, b: any) => {
    if (a.timestamp! > b.timestamp!) {
        return -1
    } else if (a.timestamp! < b.timestamp!) {
        return 1
    } else {
        return 0
    }
}