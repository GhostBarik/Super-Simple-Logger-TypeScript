# Super Simple Logger (written in TypeScript)

Custom implementation of logger in pure TypeScript.

**Zero dependencies!** - just copy this file into your project and use

Supported log levels: *ERROR*, *WARN*, *INFO*, *DEBUG*, *TRACE*


## Usage

```TypeScript
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

## Default logger output
By default logger outputs to `console.log(..)`, 
but this can be overriden by providing alternative output sink in 
`createLogger(..)` function (check function description)

## Logger output format
Output format template can be overriden for custom use 
(check the description for `createLogger(..)` function) 