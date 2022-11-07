type LoggerArgument = any;

class LoggerService {
  public log(...args: LoggerArgument[]): void {
    console.log(...args);
  }

  public warn(...args: LoggerArgument[]): void {
    console.warn(...args);
  }

  public error(...args: LoggerArgument[]): void {
    console.error(...args);
  }
}

export const loggerService = new LoggerService();
