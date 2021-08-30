import Sequelize from 'sequelize'
import mongoose from 'mongoose'

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

export interface DefineOptions {
  middle?: DefineMiddle
  router: {
    prePath?: [any, string][]
    methods: Method[]
  }
}

export interface IdenOptions {
  cvtId?: boolean
}

export interface SelectOptions extends IdenOptions {
  selCols?: string[]
  rawQuery?: boolean
  ext?: boolean
}

export interface SaveOptions extends IdenOptions {
  updMode?: UpdMode
}

export interface BasicStruct {
  __modelName: string
}

export interface IndexStruct {
  [prop: string]: any
}

export type Model = Sequelize.Model<any, any> | mongoose.Model<any>
export type Conn = Sequelize.Sequelize | mongoose.Mongoose

export interface MdlInf {
  model: Model
  name: string
  struct: IndexStruct
  options: DefineOptions
}

export interface TypeMapper {
  [tname: string]: any
}

export interface DB {
  get PropTypes (): TypeMapper
  get modelInfors (): Map<string, MdlInf>
  connect (): Promise<Conn>
  genPreRoutes (): void
  defineModel (modelName: string, struct: IndexStruct, options?: DefineOptions): MdlInf
  select (model: Model, condition?: any, options?: SelectOptions): Promise<any>
  save (model: Model, values: object, condition?: any, options?: SaveOptions): Promise<any>
  delete (model: Model, condition?: any, options?: IdenOptions): Promise<number>
  sync (model: Model): Promise<void>
  dump (model: Model, flPath: string): Promise<number>
}