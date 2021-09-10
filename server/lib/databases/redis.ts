import { createClient } from 'redis'
import * as com from './index'
import * as utils from '../utils/index'
import { RedisClientType } from 'redis/dist/lib/client'

export default class Redis implements com.Cache, com.DataWatcher {
  protected config: any

  constructor (cfgPath: string) {
    this.config = utils.readConfig(cfgPath, true).redis
  }

  connect(): Promise<com.Conn> {
    const client = createClient({
      socket: {
        url: [
          `redis://${this.config.username}`,
          `:${this.config.password}`,
          `@${this.config.host}`,
          `:${this.config.port}`
        ].join('')
      }
    })
    return new Promise((resolve, reject) => {
      client?.on('error', reject)
      client?.connect().then(() => resolve(client))
    })
  }

  private cvtClient (res: com.Conn): RedisClientType<any, any> {
    return res as RedisClientType<any, any>
  }

  use(db: string): Promise<void> {
    return this.connect().then(this.cvtClient)
      .then(client => client.select(parseInt(db)) as Promise<void>)
  }

  has(key: string): Promise<boolean> {
    return this.connect().then(this.cvtClient)
      .then(client => client.exists(key))
      .then(res => res?.valueOf() as boolean)
  }

  get(key: string): Promise<any> {
    return this.connect().then(this.cvtClient)
      .then(client => client.hGetAll(key))
  }

  set(key: string, value: any, options?: com.SetOptions): Promise<any> {
    return this.connect().then(this.cvtClient)
      .then(client => Promise.all([
        Promise.resolve(client),
        client.hSet(key, value)
      ]))
      .then(res => {
        const client = res[0]
        if (options && options.expSeconds) {
          client.expire(key, options?.expSeconds)
        }
        return value
      })
  }

  len(): Promise<number> {
    return this.connect().then(this.cvtClient)
      .then(client => client.keys('*'))
      .then(res => res ? res.length : 0)
  }

  createTopic (topic: string): Promise<any> {
    return this.connect().then(this.cvtClient)
      .then(client => client.duplicate())
      .then(subscriber => subscriber.connect())
  }

  subscribe (topic: string, callback: (msg: string) => void): Promise<any> {
    return this.createTopic(topic).then(this.cvtClient)
      .then(client => client.subscribe(topic, callback))
  }

  unsubscribe (topic: string): Promise<any> {
    return this.createTopic(topic).then(this.cvtClient)
      .then(client => client.unsubscribe(topic))
  }

  publish (topic: string, message: string): Promise<any> {
    return this.createTopic(topic).then(this.cvtClient)
      .then(client => client.publish(topic, message))
  }

  listSubs (topic: string): Promise<any[]> {
    return this.createTopic(topic).then(this.cvtClient)
      .then(client => client.pubSubChannels(topic))
  }
}
