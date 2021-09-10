import _ from 'lodash'
import mongoose from 'mongoose'
import * as utils from '../utils/index.js'
import * as com from './index.js'
mongoose.Promise = global.Promise

// @block{Mongo}:mongodb的实例类
// @role:数据库操作类
// @includes:lodash
// @includes:mongoose
// @includes:../config/db.mongo
// @includes:../utils/error
// @type:class
// @description:常量：
//  * *Types*[`object`]：可用列类型
export default class Mongo implements com.DataBase {
  protected config: any
  private static models: Map<string, com.MdlInf> = new Map<string, com.MdlInf>([])

  static readonly Types = {
    Id: mongoose.Schema.Types.ObjectId,
    String: String,
    Number: Number,
    Date: Date,
    Boolean: Boolean,
    Array: Array,
    Object: Map
  }

  static readonly Middles = new Map<com.Middle, string>([
    ['select', 'find'],
    ['create', 'save'],
    ['update', 'save'],
    ['save', 'save'],
    ['delete', 'remove'],
    ['valid', 'validate']
  ])

  constructor (cfgPath: string) {
    this.config = utils.readConfig(cfgPath, true).mongo
  }

  get PropTypes (): com.TypeMapper {
    return Mongo.Types
  }

  get modelInfors (): Map<string, com.MdlInf> {
    return Mongo.models
  }

  // @block{connect}:数据库连接方法
  // @description:连接后方可操作数据库
  // @type:function (prototype)
  // @return{conn}[Promise]:连接Promise
  connect (): Promise<com.Conn> {
    return mongoose.connect([
      'mongodb://',
      (this.config.username ? `${this.config.username}:` : ''),
      (this.config.password ? `${this.config.password}@` : ''),
      `${this.config.host}:`,
      `${this.config.port}/`,
      `${this.config.database}?authSource=admin`
    ].join(''), {
      useNewUrlParser: true,
      keepAlive: false,
      useUnifiedTopology: true
    })
  }

  genPreRoutes(): void {
    for (const [mname, minfo] of Mongo.models) {
      for (const [cname, prop] of this.getRefCollection(minfo.model)) {
        const prePath: [any, string] = [prop, `${mname}/:${mname}_index`]
        if (!Mongo.models.has(cname)) { continue }
        const tgtMdlInf = Mongo.models.get(cname)
        if (!tgtMdlInf) {
          continue
        }
        if (!tgtMdlInf.options.router.prePath) {
          tgtMdlInf.options.router.prePath = [prePath]
        } else {
          tgtMdlInf.options.router.prePath.push(prePath)
        }
      }
    }
  }

  defineModel (modelName: string, struct: com.IndexStruct, options: com.DefineOptions = {
    router: { methods: [] }
  }): com.MdlInf {
    const schema = new mongoose.Schema(struct)
    for (const [mid, pcsFun] of Object.entries(options.middle || {})) {
      const middle: com.Middle = <com.Middle>mid
      if (!middle || !Mongo.Middles.has(middle)) {
        continue
      }
      for (const [process, func] of Object.entries(pcsFun)) {
        switch (process) {
          case 'before':
            schema.pre(<string>Mongo.Middles.get(middle), function (next) {
              func(this)
              next()
            })
            break
          case 'doing':
            console.error('mongoose不支持doing中间件')
            break
          case 'after':
            schema.post(<string>Mongo.Middles.get(middle), function () {
              func(this)
            })
            break
        }
      }
    }

    const model: com.MdlInf = {
      model: mongoose.model(modelName, schema),
      name: modelName,
      struct, options
    }
    Mongo.models.set(modelName, model)
    return model
  }

  private getRefCollection (model: com.Model): Map<string, any> {
    const ret: Map<string, any> = new Map<string, any>([])
    const mgModel = <mongoose.Model<any>>model
    if (!Mongo.models.has(mgModel.modelName)) {
      return ret
    }
    const minfo = Mongo.models.get(mgModel.modelName)
    if (!minfo) {
      return ret
    }
    for (const [pname, pattr] of Object.entries(minfo.struct)) {
      let ptype = pattr
      if (ptype instanceof Array) {
        ptype = ptype[0]
      }
      if (ptype.ref) {
        ret.set(pname, ptype.ref)
      }
    }
    return ret
  }

  cvtIdToIdx (self: Mongo, res: any): any {
    const ret = res.toObject ? res.toObject() : res
    if (!ret._id) {
      return ret
    }
    ret._index = ret._id
    delete ret._id
    for (const [key, val] of Object.entries(ret)) {
      if (key === '_index' || key === '_v') {
        continue
      }
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; ++i) {
            val[i] = self.cvtIdToIdx(self, val[i])
          }
          ret[key] = val
        } else {
          ret[key] = self.cvtIdToIdx(self, val)
        }
      }
    }
    return ret
  }

  async select(model: com.Model, condition?: any, options?: com.SelectOptions): Promise<any> {
    options = Object.assign({
      selCols: [], rawQuery: false, ext: false
    }, options)
    if (condition && condition._index) {
      condition._id = condition._index
      delete condition._index
    }

    await this.connect()

    let order_by = null
    if (condition.order_by) {
      order_by = condition.order_by
      delete condition.order_by
      if (typeof order_by === 'string') {
        order_by = JSON.parse(order_by)
      }
    }

    let limit = null
    if (condition.limit) {
      limit = condition.limit
      delete condition.limit
    }

    const mgModel = <mongoose.Model<any>>model
    const props: string[] = []
    mgModel.schema.eachPath((prop: string) => {
      props.push(prop)
    })
    let selCols = props.join(' ')
    if (options.selCols) {
      selCols = options.selCols.join(' ')
    }

    let res = <mongoose.Query<any[], any, {}, any>>model.find(condition, selCols)
    if (order_by) {
      res = res.sort(order_by)
    }
    if (limit) {
      res = res.limit(Number.parseInt(limit))
    }
    if (options.ext) {
      for (const prop of this.getRefCollection(model)) {
        res = res.populate(prop)
      }
    }
    return res.exec().then(ress => Promise.resolve(ress.map(res => this.cvtIdToIdx(this, res))))
  }

  async save(model: com.Model, values: object, condition?: any, options?: com.SaveOptions): Promise<any> {
    const mgModel = <mongoose.Model<any>>model

    options = Object.assign({
      cvtId: true, updMode: 'cover'
    }, options)
    if (condition && condition._index) {
      condition._id = condition._index
      delete condition._index
    }

    await this.connect()

    let ress: any
    if (condition) {
      ress = await mgModel.find(condition)
    }

    if (!ress || !ress.length) {
      return mgModel.create(values).then(res => Promise.resolve([this.cvtIdToIdx(this, res)]))
    }

    const pmss: Promise<any>[] = []
    for (const res of ress) {
      for (const [key, value] of Object.entries(values)) {
        if (!options.updMode) {
          break
        }
        switch (options.updMode.toLowerCase()) {
          case 'append':
            const propType = mgModel.schema.path(key)
            if (propType instanceof Mongo.Types.String) {
              res[key] += value
            } else if (propType instanceof Array) {
              // https://github.com/Automattic/mongoose/issues/4455
              res[key] = res[key].concat([value])
            } else if (propType instanceof Number) {
              res[key] += value
            } else {
              res[key] = value
            }
            break
          case 'cover':
          default:
            res[key] = value
        }
      }
      pmss.push(res.save())
    }
    return Promise.all(pmss.map(pms => pms.then(res => Promise.resolve(this.cvtIdToIdx(this, res)))))
  }

  delete(model: com.Model, condition?: any, options?: com.DeleteOptions): Promise<number> {
    const mgModel = <mongoose.Model<any>>model

    if (condition && condition._index) {
      condition._id = condition._index
      delete condition._index
    }
    return this.connect()
      .then(() => mgModel.deleteOne(condition))
      .then(res => Promise.resolve(res.deletedCount || 0))
  }

  sync(model: com.Model): Promise<void> {
    return this.connect().then(() => new Promise((res, rej) => {
      (<mongoose.Model<any>>model).deleteMany({}, err => {
        err ? rej(err) : res()
      })
    }))
  }

  async dump(model: com.Model, flPath: string): Promise<number> {
    const data = <any[]>require(flPath).data
    await this.connect()
    await Promise.all(data.map(record => model.create(record)))
    return Promise.resolve(data.length)
  }
}
