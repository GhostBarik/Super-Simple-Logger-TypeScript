/**
 * Custom implementation of Logger in pure TypeScript.
 * ZERO DEPENDENCIES - just copy this file into your project and use
 * 
 * supported log levels: ERROR, WARN, INFO, DEBUG, TRACE
 * 
 * DEFAULT OUTPUT: by default logger outputs to console.log(..), 
 * but this can be overriden by providing alternative output sink in 
 * createLogger(..) function (check function description)
 * 
 * LOGGER OUTPUT FORMAT: output format template can be overriden for custom use 
 * (check the description for createLogger(..) function) 
 * 
 * author: Daniil Barabash (ghostbarik@gmail.com)
 * date: 14/07/2021
 */

 type FormatParameters = {[key: string]: any}

export interface Logger {
    error(message: string): void
    warn(message: string): void
    info(message: string): void
    debug(message: string): void
    trace(message: string): void
}

export interface AsyncLogger {
    error(message: string): Promise<void>
    warn(message: string):  Promise<void>
    info(message: string):  Promise<void>
    debug(message: string): Promise<void>
    trace(message: string): Promise<void>
}

export enum LogLevel {
    ERROR = 0,
    WARN  = 1,
    INFO  = 2,
    DEBUG = 3,
    TRACE = 4
}

export const defaultLoggerFormat = '[level=$logLevel, module=$moduleName, $formattedTimestamp]: $message'
export const consoleLoggerSink = (message: string): void => console.log(message)

const LogLevelStr = {
    [LogLevel.ERROR]: "ERROR",
    [LogLevel.WARN]:  "WARN",
    [LogLevel.INFO]:  "INFO",
    [LogLevel.DEBUG]: "DEBUG",
    [LogLevel.TRACE]: "TRACE",
}

const formatString = (template: string, parameters: FormatParameters): string =>
    Object.keys(parameters)
    .reduce((template, key) => 
        template.replace('$' + `${key}`, `${parameters[key]}`), 
        template
    )


/**
 * USAGE:
 * 
 * // create logger for module 'MAIN' with level set to 'INFO', 
 * // i.e. only message with level = ERROR, WARN, INFO will be printed by the logger
 * 
 * ----------------------------------------------------
 * const logger = createLogger('MAIN', LogLevel.INFO)
 * 
 * logger.error("error message")  // will be printed
 * logger.warn("warning message") // will be printed
 * logger.info("info message")    // will be printed
 * logger.debug("debug message")  // WILL NOT BE PRINTED
 * logger.trace("trace message")  // WILL NOT BE PRINTED
 * ----------------------------------------------------
 */
export function createLogger(
    moduleName: string = 'GLOBAL', 
    logLevel: LogLevel = LogLevel.INFO, 
    format: string = defaultLoggerFormat, 
    outputSink: (message: string) => void = consoleLoggerSink): Logger {

    const logFormattedMessage = 
        (logLevel: LogLevel, moduleName: string) => 
        (message: string) => {

        const formattedTimestamp = new Date().toISOString()
        const parameters = {
            'moduleName': moduleName,
            'formattedTimestamp': formattedTimestamp,
            'logLevel': LogLevelStr[logLevel],
            'message': message
        }
        const formattedMessage = formatString(format, parameters)
        outputSink(formattedMessage)
    }

    const filterAndLogMessage = 
        (currentLogLevel: LogLevel, moduleName: string) => 
        (requiredLogLevel: LogLevel) => 
        (message: string) => {

        if (requiredLogLevel <= currentLogLevel) {
            logFormattedMessage(requiredLogLevel, moduleName)(message)
        }
    }

    const applied = filterAndLogMessage(logLevel, moduleName)

    return {
        error: applied(LogLevel.ERROR),
        warn:  applied(LogLevel.WARN),
        info:  applied(LogLevel.INFO),
        debug: applied(LogLevel.DEBUG),
        trace: applied(LogLevel.TRACE)
    }
}

/**
 * Asynchronous version of the logger, that uses asynchronous output sink.
 * This is useful for cases, where output sink is some remote logging service.
 * User has a choice of how to handle error in the case when delivery of async message fails.
 * (i.e. broken connection to remote service, bad URL provided etc.)
 * 
 * Example of simple asynchronous sink, which simulates remote log service behavior:
 * 
 * -----------------------------------------------------------------------------------------
 * const fakeRemoteServiceSink = (message: string): Promise<void> => {
 *   return new Promise<void>((resolve, reject) => {
 *       setTimeout(() => {
 *           // simulate random remote server error
 *           if (Math.random() > 0.5) {
 *               reject()
 *           } else {
 *               // no error -> "fake" write to remote server
 *               console.log(`${message}`)
 *               resolve()
 *           }
 *       // simulate delay by waiting 1 second until log message is delivered
 *       }, 1000)
 *   })
 *  }
 * 
 * const asyncLogger = createAsyncLogger('TEST', LogLevel.INFO, defaultLoggerFormat, customAsyncSink)
 * 
 * // you can use either async/await syntax or Promise API to deliver the message
 * asyncLogger.info("test info message")
 *     .then(() => console.log('logged successfully'))
 *     .catch(() => console.log('log message cannot be delivered'))
 * ------------------------------------------------------------------------------------------
 */
export function createAsyncLogger(
    moduleName: string = 'GLOBAL', 
    logLevel: LogLevel = LogLevel.INFO, 
    format: string = defaultLoggerFormat, 
    outputSink: (message: string) => Promise<void>): AsyncLogger {

    const logFormattedMessage = 
        (logLevel: LogLevel, moduleName: string) => 
        (message: string): Promise<void> => {

        const formattedTimestamp = new Date().toISOString()
        const parameters = {
            'moduleName': moduleName,
            'formattedTimestamp': formattedTimestamp,
            'logLevel': LogLevelStr[logLevel],
            'message': message
        }
        const formattedMessage = formatString(format, parameters)
        return outputSink(formattedMessage)
    }

    const filterAndLogMessage = 
        (currentLogLevel: LogLevel, moduleName: string) => 
        (requiredLogLevel: LogLevel) => 
        (message: string): Promise<void> => {

        if (requiredLogLevel <= currentLogLevel) {
            return logFormattedMessage(requiredLogLevel, moduleName)(message)
        }
        return (async () => {})()
    }

    const applied = filterAndLogMessage(logLevel, moduleName)

    return {
        error: applied(LogLevel.ERROR),
        warn:  applied(LogLevel.WARN),
        info:  applied(LogLevel.INFO),
        debug: applied(LogLevel.DEBUG),
        trace: applied(LogLevel.TRACE)
    }
}
