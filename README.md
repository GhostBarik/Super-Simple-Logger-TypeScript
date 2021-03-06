# Super Simple TypeScript Logger

Custom implementation of logger in pure TypeScript.

**Zero dependencies!** - just copy `logger.ts` file into your project and use

Supported log levels: *ERROR*, *WARN*, *INFO*, *DEBUG*, *TRACE*


## Usage

```TypeScript
import createLogger from logger

// create logger for module 'MAIN' with level set to 'INFO', 
// i.e. only message with level = ERROR, WARN, INFO will be printed by the logger
const logger = createLogger('MAIN', LogLevel.INFO)

logger.error("error message")  // will be printed
logger.warn("warning message") // will be printed
logger.info("info message")    // will be printed
logger.debug("debug message")  // WILL NOT BE PRINTED
logger.trace("trace message")  // WILL NOT BE PRINTED

// output example
logger.info("message example")
==> '[level=INFO, module=MAIN, 2021-07-14T19:20:44.156Z]: message example'
```

## Default Logger Output
By default logger outputs to `console.log(..)`, 
but this can be overriden by providing alternative output sink in 
`createLogger(..)` function (check function description)

## Logger Output Format
Output format template can be overriden for custom use 
(check the description for `createLogger(..)` function)

## Asynchronous Logging
In case logger needs to write to some remote service (i.e. it needs to call asynchronous function),
you can use asynchronous version of the logger factory function -> `createAsyncLogger(..)` (check function description for usage example).
