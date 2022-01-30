import logger, { Logger, LOG_LEVELS } from '..';
import type { LogLevel } from '..';

describe('mini-console-logger', () => {
  it('returns Logger instance', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it('has expected log levels', () => {
    const expectedLevels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'].sort();
    expect(Object.keys(LOG_LEVELS).sort()).toEqual(expectedLevels);
  });

  describe('Logger class', () => {
    it('gets log level', () => {
      expect(new Logger().level).toBe(LOG_LEVELS.TRACE);
    });

    it('sets log level', () => {
      const logger = new Logger();
      logger.level = LOG_LEVELS.WARN;
      expect(logger.level).toBe(LOG_LEVELS.WARN);
    });

    describe('.getInstance', () => {
      it('returns previous Logger instance if one exists', () => {
        const instance1 = Logger.getInstance();
        const instance2 = Logger.getInstance();

        expect(instance1).toBe(instance2);
      });
    });

    describe('.on', () => {
      it('adds a listener', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const consoleStub = {
          info() {}
        } as Console;
        const logger = new Logger(consoleStub);
        const spy = jest.fn();

        logger.on(LOG_LEVELS.INFO, spy);
        logger.info('test1');
        logger.info('test2');

        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('.off', () => {
      it('removes a listener', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const consoleStub = {
          info() {}
        } as Console;
        const logger = new Logger(consoleStub);
        const spy = jest.fn();

        logger.on(LOG_LEVELS.INFO, spy);
        logger.info('test1');
        logger.off(LOG_LEVELS.INFO, spy);
        logger.info('test2');

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('.log', () => {
      const createFullConsoleStub = () =>
        ({
          trace: jest.fn(),
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn()
        } as unknown as Console);

      it('obeys level', () => {
        const consoleStub = createFullConsoleStub();
        const logger = new Logger(consoleStub);
        logger.level = LOG_LEVELS.WARN;

        Object.keys(LOG_LEVELS).forEach(key => {
          const level = LOG_LEVELS[key as Uppercase<LogLevel>];
          logger[level]('test');
        });

        expect(consoleStub.warn).toHaveBeenCalledTimes(1);
        expect(consoleStub.error).toHaveBeenCalledTimes(1);
      });

      it('obeys null level', () => {
        const consoleStub = createFullConsoleStub();
        const logger = new Logger(consoleStub);
        logger.level = null;

        Object.keys(LOG_LEVELS).forEach(key => {
          const level = LOG_LEVELS[key as Uppercase<LogLevel>];
          logger[level]('test');
        });

        Object.keys(consoleStub).forEach(key => {
          expect(
            consoleStub[key as keyof typeof consoleStub]
          ).not.toHaveBeenCalled();
        });
      });

      it('stringifies plain objects', () => {
        const consoleStub = {
          trace: jest.fn()
        } as unknown as Console;
        const logger = new Logger(consoleStub);

        const obj = {
          prop1: 'test1',
          prop2: 'test2'
        };

        logger[LOG_LEVELS.TRACE](obj);

        expect(consoleStub.trace).toHaveBeenCalledTimes(1);
        expect(consoleStub.trace).toHaveBeenCalledWith(JSON.stringify(obj));
      });

      it('logs errors as json', () => {
        const consoleStub = {
          error: jest.fn()
        } as unknown as Console;
        const logger = new Logger(consoleStub);

        const err = new Error('foo');

        logger[LOG_LEVELS.ERROR](err);

        expect(consoleStub.error).toHaveBeenCalledTimes(1);
        expect(consoleStub.error).toHaveBeenCalledWith(
          JSON.stringify({
            event: 'error',
            message: err.message,
            name: err.name,
            stack: err.stack
          })
        );
      });
    });

    Object.keys(LOG_LEVELS)
      .map(k => LOG_LEVELS[k as Uppercase<LogLevel>])
      .forEach(level => {
        describe('.' + level, () => {
          it('calls _log method', () => {
            const logger = new Logger();

            // @ts-ignore
            const logMethod = (logger._log = jest.fn());

            logger[level]('test');

            expect(logMethod).toHaveBeenCalledTimes(1);
            expect(logMethod).toHaveBeenCalledWith(level, ['test']);
          });

          it('returns Logger instance for chaining', () => {
            const logger = new Logger();

            expect(logger[level]()).toBeInstanceOf(Logger);
          });
        });
      });
  });
});
