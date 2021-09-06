import { getDatabase } from '../utils/index.js'

const db = await getDatabase()

export default db.defineModel('message', {
  content: db.PropTypes.String,
  sender: db.PropTypes.String, // seller/buyer
  good: { type: db.PropTypes.Id, ref: 'good' },
  buyer: { type: db.PropTypes.Id, ref: 'user' },
  createdAt: db.PropTypes.Date
}, {
  middle: {
    create: {
      before (doc) {
        doc.createdAt = new Date()
      }
    }
  },
  router: {
    methods: ['GET', 'ALL', 'POST', 'DELETE']
  }
})
