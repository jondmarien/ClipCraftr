export type Loggable =
  | Error
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | undefined;

export interface Logger {
  error: (message: string, meta?: Loggable) => void;
  warn: (message: string, meta?: Loggable) => void;
  info: (message: string, meta?: Loggable) => void;
  http: (message: string, meta?: Loggable) => void;
  verbose: (message: string, meta?: Loggable) => void;
  debug: (message: string, meta?: Loggable) => void;
  silly: (message: string, meta?: Loggable) => void;
}
