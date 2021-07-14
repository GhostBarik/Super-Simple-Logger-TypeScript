/**
 * Custom implementation of Logger in pure TypeScript.
 * ZERO DEPENDENCIES - just copy this file into your project and use
 * 
 * supported log levels: ERROR, WARN, INFO, DEBUG, TRACE
 * 
 * USAGE:
 * 
 * // create logger for module 'MAIN' with level set to 'INFO', 
 * // i.e. only message with level = ERROR, WARN, INFO will be printed by the logger
 * ----------------------------------------------------
 * const logger = createLogger('MAIN', LogLevel.INFO)
 * logger.error("error message") // will be printed
 * logger.info("info message")   // will be printed
 * logger.trace("trace message") // WILL NOT BE PRINTED
 * ----------------------------------------------------
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

export interface Logger {
    error(message: string): void
    warn(message: string): void
    info(message: string): void
    debug(message: string): void
    trace(message: string): void
}

export enum LogLevel {
    ERROR = 0,
    WARN  = 1,
    INFO  = 2,
    DEBUG = 3,
    TRACE = 4
}

type FormatParameters = {[key: string]: any}

const defaultLoggerFormat = '[level=$logLevel, module=$moduleName, $formattedTimestamp]: $message'
const consoleLoggerSink = (message: string): void => console.log(message)

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

export function createLogger(
    moduleName: string = 'GLOBAL', 
    logLevel: LogLevel = LogLevel.INFO, 
    format: string = defaultLoggerFormat, 
    outputSink: (message: string) => void = consoleLoggerSink): Logger {

    const logFormattedMessage = (logLevel: LogLevel, moduleName: string) => (message: string) => {
        const formattedTimestamp = new Date().toISOString()
        const parameters = {
            'moduleName': moduleName,
            'formattedTimestamp': formattedTimestamp,
            'logLevel': LogLevelStr[logLevel],
            'message': message,
        }
        const formattedMessage = formatString(format, parameters)
        outputSink(formattedMessage)
    }

    const filterAndLogMessage = 
        (currentLogLevel: LogLevel, moduleName: string) => 
        (requiredLogLevel: LogLevel) => (message: string) => {

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