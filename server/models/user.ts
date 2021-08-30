import { createHmac } from 'crypto'
import * as utils from '../utils/index.js'

const db = await utils.getDatabase()
const svrCfg = utils.getServerInfo()

export default db.defineModel('user', {
  username: db.PropTypes.String,
  password: db.PropTypes.String,
  phone: db.PropTypes.String,
}, {
  middle: {
    create: {
      before (doc) {
        if (doc.password.length !== 64) {
          doc.password = createHmac('sha256', svrCfg.secret)
            .update(doc.password).digest('hex')
        }
      }
    }
  },
  router: {
    methods: ['GET', 'ALL', 'PUT']
  }
})
