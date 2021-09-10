import path from 'path'
import { DB } from '../lib/databases/index.js'
import { readConfig } from '../lib/utils/index.js'

const __dirname = path.resolve()
const cfgPath = path.resolve(__dirname, '..', 'configs')
const mdlCfgPath = path.resolve(cfgPath, 'models')
const dbCfgPath = path.resolve(cfgPath, 'db')
const svrCfgPath = path.resolve(cfgPath, 'server')

export function getRootPath () {
  return path.resolve(__dirname, '..')
}

export async function getDatabase (): Promise<DB> {
  const dbName = readConfig(mdlCfgPath).type
  const ImplDB = await import(`../lib/databases/${dbName}.js`)
  return new ImplDB.default(dbCfgPath)
}

export function getServerInfo () {
  return readConfig(svrCfgPath, true)
}
