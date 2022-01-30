# mini-console-logger

[![npm latest](https://img.shields.io/npm/v/mini-console-logger)](https://www.npmjs.com/package/mini-console-logger)
[![npm prerelease](https://img.shields.io/npm/v/mini-console-logger/next?color=orange)](https://www.npmjs.com/package/mini-console-logger)
![module formats: es, cjs](https://img.shields.io/badge/module%20formats-es%2C%20cjs-green)

Simple logging utility.

```
npm install mini-console-logger --save
```

## Usage

```js
import logger, { LOG_LEVELS } from 'mini-console-logger';

logger.trace('trace');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.error('error');

// objects and Errors are stringified automatically
logger.debug({
  prop1: 'foo',
  prop2: 'bar'
});
logger.error(new Error('foo'));

logger.level = null; // silence logger
logger.level = LOG_LEVELS.WARN; // log only warn and above

logger.on(LOG_LEVELS.ERROR, err => {
  // do something with the error
});
logger.off(LOG_LEVELS.ERROR); // unbind error listener
```

[Live demo](http://jsbin.com/cawiwep/edit?js,console)
