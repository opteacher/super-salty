import { getDatabase } from '../utils/index.js'

const db = await getDatabase()

export default db.defineModel('message', {
  topic: db.PropTypes.String, // good的索引 + buyer的索引（之间用.分隔）
  content: db.PropTypes.String,
  sender: { type: db.PropTypes.Id, ref: 'user' },
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
