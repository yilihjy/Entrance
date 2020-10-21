/* eslint-disable */
class MyConsole implements Console {
  constructor() {
    this.memory = console.memory;
    this.active = process.env.NODE_ENV == "development";
  }
  memory: any;
  active: boolean;
  assert(condition?: boolean, ...data: any[]): void {
    if (this.active) console.assert(condition, ...data);
  }
  clear(): void {
    console.clear();
  }
  count(label?: string): void {
    if (this.active) console.count(label);
  }
  countReset(label?: string): void {
    if (this.active) console.countReset(label);
  }
  debug(...data: any[]): void {
    if (this.active) console.debug(...data);
  }
  dir(item?: any, options?: any): void {
    if (this.active) console.dir(item, options);
  }
  dirxml(...data: any[]): void {
    if (this.active) console.dirxml(...data);
  }
  error(...data: any[]): void {
    console.error(...data);
  }
  exception(message?: string, ...optionalParams: any[]): void {
    if (this.active) console.exception(message, ...optionalParams);
  }
  group(...data: any[]): void {
    if (this.active) console.group(...data);
  }
  groupCollapsed(...data: any[]): void {
    if (this.active) console.groupCollapsed(...data);
  }
  groupEnd(): void {
    if (this.active) console.groupEnd();
  }
  info(...data: any[]): void {
    if (this.active) console.info(...data);
  }
  log(...data: any[]): void {
    if (this.active) console.log(...data);
  }
  table(tabularData?: any, properties?: string[]): void {
    if (this.active) console.table(tabularData, properties);
  }
  time(label?: string): void {
    if (this.active) console.time(label);
  }
  timeEnd(label?: string): void {
    if (this.active) console.timeEnd(label);
  }
  timeLog(label?: string, ...data: any[]): void {
    if (this.active) console.timeLog(label, ...data);
  }
  timeStamp(label?: string): void {
    if (this.active) console.timeStamp(label);
  }
  trace(...data: any[]): void {
    if (this.active) console.trace(...data);
  }
  warn(...data: any[]): void {
    console.warn(...data);
  }
}

const newConsole = new MyConsole();

export default newConsole;
