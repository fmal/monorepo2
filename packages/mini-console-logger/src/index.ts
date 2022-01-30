const LEVELS = ['trace', 'debug', 'info', 'warn', 'error'] as const;

export type LogLevel = typeof LEVELS[number];

export const LOG_LEVELS = Object.freeze(
  LEVELS.reduce((acc, lvl) => {
    acc[lvl.toUpperCase() as Uppercase<LogLevel>] = lvl;
    return acc;
  }, {} as Record<Uppercase<LogLevel>, LogLevel>)
);

type Listener = (...args: any[]) => void;
type ListenersMap = Record<LogLevel, Listener[]>;
type AnyArgs = any[];

let instance: Logger;

export class Logger {
  #level: LogLevel | null;
  #listeners: ListenersMap;
  #consoleObj: Console;

  constructor(consoleObj = window.console) {
    const level = LOG_LEVELS.TRACE;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const listeners = {} as ListenersMap;

    this.#level = level;
    this.#listeners = listeners;
    this.#consoleObj = consoleObj;
  }

  static getInstance() {
    if (!instance) {
      instance = new Logger();
    }

    return instance;
  }

  private _log(level: LogLevel, args: AnyArgs) {
    const loggerLevel = this.#level;
    const consoleObj = this.#consoleObj;

    const isDisabled = loggerLevel === null;

    if (isDisabled) {
      return null;
    }

    const isSilenced = LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);

    if (isSilenced) {
      return null;
    }

    const stringArgs: AnyArgs = [];

    args.forEach((arg, i) => {
      if (isPlainObject(arg)) {
        try {
          stringArgs[i] = JSON.stringify(arg);
        } catch (error) {
          stringArgs[i] = arg;
        }
      } else if (arg instanceof Error) {
        stringArgs[i] = JSON.stringify(
          'toJSON' in arg
            ? arg
            : {
                event: 'error',
                message: arg.message,
                name: arg.name,
                stack: arg.stack
              }
        );
      } else {
        stringArgs[i] = arg;
      }
    });

    const fn = consoleObj[level] || consoleObj.log;
    fn.apply(consoleObj, stringArgs);

    const listeners = this.#listeners[level];

    if (listeners && listeners.length > 0) {
      listeners.forEach(listener => listener.apply(null, args));
    }
  }

  get level() {
    return this.#level;
  }

  set level(newLevel: LogLevel | null) {
    this.#level = newLevel;
  }

  on(key: LogLevel, fn: Listener) {
    const listeners = this.#listeners;
    const listener = listeners[key] || (listeners[key] = []);
    listener.push(fn);

    return () => {
      this.off(key, fn);
    };
  }

  off(key: LogLevel, fn: Listener) {
    const listeners = this.#listeners;

    if (!listeners[key]) {
      return;
    }

    if (!fn) {
      listeners[key] = [];
    }

    listeners[key] = listeners[key].filter(listener => listener !== fn);
  }

  trace(...args: AnyArgs) {
    this._log(LOG_LEVELS.TRACE, args);
    return this;
  }

  debug(...args: AnyArgs) {
    this._log(LOG_LEVELS.DEBUG, args);
    return this;
  }

  info(...args: AnyArgs) {
    this._log(LOG_LEVELS.INFO, args);
    return this;
  }

  warn(...args: AnyArgs) {
    this._log(LOG_LEVELS.WARN, args);
    return this;
  }

  error(...args: AnyArgs) {
    this._log(LOG_LEVELS.ERROR, args);
    return this;
  }
}

function isPlainObject(obj: any) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj.constructor === Object || Object.getPrototypeOf(obj) === null)
  );
}

export default Logger.getInstance();
