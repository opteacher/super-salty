import * as utils from '../utils/index.js'

const db = await utils.getDatabase()

export default db.defineModel('order', {
  price: db.PropTypes.Number,
  tags: db.PropTypes.Array, // good tags的基础上附加的标签。如宝贝原先不保修，后买家与卖家交涉后，可将包邮的标签打入这里
  good: { type: db.PropTypes.Id, ref: 'good' },
  buyer: { type: db.PropTypes.Id, ref: 'user' },
  status: db.PropTypes.String, // Pay/Send/Sending/Receive/Evaluate/Returned/Closed
  delivery: db.PropTypes.String,
  createdAt: db.PropTypes.Date,
  updatedAt: db.PropTypes.Date,
}, {
  middle: {
    create: {
      before (doc: any) {
        if (!doc.createdAt) {
          doc.createdAt = new Date()
        }
        doc.updatedAt = new Date()
      }
    }
  },
  router: {
    methods: ['GET', 'ALL', 'PUT', 'POST', 'DELETE']
  }
})
