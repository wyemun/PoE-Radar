import { EventEmitter } from "events"
import { promisify } from 'util'

const sleep = promisify(setTimeout)

export enum EventType {
  Start = 'fp:start',
  LocationChanged = 'fp:location:changed',
}

export default class FilePoller {
  private dispatcher: EventEmitter

  constructor (dispatcher: EventEmitter) {
    this.dispatcher = dispatcher
  }

  async start (): Promise<void> {
    await sleep(5000)
    this.dispatcher.emit(EventType.Start, {})
  }
} 