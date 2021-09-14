import path from 'path'
import { DataBase } from '../lib/databases/index.js'
import { readConfig } from '../lib/utils/index.js'

export const cfgPath = path.resolve('..', 'configs')
const mdlCfgPath = path.resolve(cfgPath, 'models')
const dbCfgPath = path.resolve(cfgPath, 'db')
const svrCfgPath = path.resolve(cfgPath, 'server')

export function getRootPath () {
  return path.resolve('..')
}

export async function getDatabase (): Promise<DataBase> {
  const dbName = readConfig(mdlCfgPath).type
  const ImplDB = await import(`../lib/databases/${dbName}.js`)
  return new ImplDB.default(dbCfgPath)
}

export function getServerInfo () {
  return readConfig(svrCfgPath, true)
}
