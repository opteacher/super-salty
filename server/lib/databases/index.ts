import Sequelize from 'sequelize'
import mongoose from 'mongoose'
import { RedisClientType } from 'redis/dist/lib/client'

export type Middle = 'select' | 'create' | 'update' | 'save' | 'delete' | 'valid'
export type Process = 'before' | 'doing' | 'after'
export type Type = 'Id' | 'String' | 'Number' | 'Date' | 'Boolean' | 'Array' | 'Object'
export type UpdMode = 'cover' | 'append'
export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'ALL' | 'LINK'

type DefineMiddle = {
  [middle in Middle]?: {
    [process in Process]?: (record: any) => void
  }
}

export interface DefineOptions extends IndexStruct {
  middle?: DefineMiddle
  router: {
    prePath?: [any, string][]
    methods: Method[]
  }
}

export interface SelectOptions extends IndexStruct {
  selCols?: string[]
  rawQuery?: boolean
  ext?: boolean | string[]
}

export interface SaveOptions extends IndexStruct {
  updMode?: UpdMode
}

export interface DeleteOptions extends IndexStruct {

}

export interface BasicStruct {
  __modelName: string
}

export interface IndexStruct {
  [prop: string]: any
}

export interface NamedStruct extends IndexStruct {
  modelName: string
}

export type Model = Sequelize.Model<any, any> | mongoose.Model<any> | null
export type Conn = Sequelize.Sequelize | mongoose.Mongoose | RedisClientType<any, any>

export interface MdlInf {
  model: Model
  name: string
  struct: IndexStruct
  options: DefineOptions
}

export interface TypeMapper {
  [tname: string]: any
}

export interface DataBase {
  get PropTypes (): TypeMapper
  get modelInfors (): Map<string, MdlInf>
  connect (): Promise<Conn>
  genPreRoutes (): void
  useDataBase (dbName: string): Promise<boolean>
  defineModel (modelName: string, struct: IndexStruct, options?: DefineOptions): MdlInf
  select (mdlInf: MdlInf, condition?: any, options?: SelectOptions): Promise<any>
  save (mdlInf: MdlInf, values: any, condition?: any, options?: SaveOptions): Promise<any>
  delete (mdlInf: MdlInf, condition?: any, options?: DeleteOptions): Promise<number>
  sync (mdlInf: MdlInf): Promise<void>
  dump (mdlInf: MdlInf, flPath: string): Promise<number>
}

export interface OperOptions {
  operType?: string
}

export interface GetOptions extends OperOptions{
}

export interface SetOptions extends OperOptions {
  expSeconds?: number
}

export interface Cache {
  connect (): Promise<Conn>
  use (db: string): Promise<void>
  has (key: string): Promise<boolean>
  get (key: string, params?: any[], options?: GetOptions): Promise<any>
  set (key: string, value: any, options?: SetOptions): Promise<any>
  len (): Promise<number>
}

export interface DataWatcher {
  createTopic (topic: string): Promise<any>
  subscribe (topic: string, callback: (msg: string) => void): Promise<any>
  unsubscribe (topic: string): Promise<any>
  publish (topic: string, message: string): Promise<any>
  listSubs (topic: string): Promise<Array<any>>
}
