import { EventEmitter } from "events"
import { promisify } from 'util'
import fs from 'fs'
import readline from 'readline'
import actsData from '../json/acts.json'

const sleep = promisify(setTimeout)

export enum EventType {
  Unknown = 'fp:unknown',
  Start = 'fp:start',
  LocationChanged = 'fp:location:changed',
}

interface Zone {
  hastrial: boolean
  note: string
  name: string
  haspassive: boolean
  questRewardsSkills: boolean
  quest: string
  hasRecipe: boolean
  act?: number
}

const zoneData: Zone[] = (() => {
  let data: Zone[] = []

  actsData.acts.forEach(act => {
    const zones = act.zones.map(z => {
      const nz: Zone = {
        ...z,
        act: act.actid
      }
      return nz
    })
    data = [...data, ...zones]
  })

  return data
})()

export default class FilePoller {
  private dispatcher: EventEmitter
  private clientPath: string

  constructor (dispatcher: EventEmitter, clientPath: string) {
    this.dispatcher = dispatcher
    this.clientPath = clientPath
  }

  private readLastLine (filePath: string): Promise<string> {
      const inStream = fs.createReadStream(filePath);
      return new Promise((resolve, reject)=> {
          const rl = readline.createInterface(inStream);
    
          let lastLine = ''
          rl.on('line', function (line) {
            lastLine = line
          })
    
          rl.on('error', reject)
    
          rl.on('close', function () {
              resolve(lastLine)
          })
      })
  }

  private matchZone (locationName: string): Zone | undefined {
    console.log('Finding', locationName)
    return zoneData.find(({name}) => name === locationName)
  }

  private startWatchingFile () {
    const locationChangeRegex = /(?:\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}:\d{2}) (?:\d+) (?:[0-9a-zA-Z]{3}) (?:\[INFO Client \d{4}\]) : You have entered ([a-zA-Z0-9 ']+)./

    fs.watchFile(this.clientPath, async () => {
      try {
        const lastLine = await this.readLastLine(this.clientPath)
        const matches = lastLine.match(locationChangeRegex)
  
        if (matches) {
          const [, time, location] = matches
          console.log(time, '-->', location, '\n')
          // const found = data[location] || ['?']

          const zoneMatched = this.matchZone(location)

          if (zoneMatched) {
            console.log('Note:', zoneMatched.note)
          }
        }
      } catch (e) {
        console.log('Failed to read last line', e)
      }
    })
  }

  async start (): Promise<void> {
    console.log('Start polling this file: ', this.clientPath)
    this.startWatchingFile()
    // ! Testing only
    await sleep(5000)
    this.dispatcher.emit(EventType.Start, {})
  }
} 