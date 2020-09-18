import { EventEmitter } from "events";

export default interface Server {
  serve (): Promise<void>
  getDispatcher (): EventEmitter
  getPort (): string
}