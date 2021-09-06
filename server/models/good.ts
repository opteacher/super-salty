import { getDatabase } from '../utils/index.js'

const db = await getDatabase()

export default db.defineModel('good', {
  cover: db.PropTypes.String,
  name: db.PropTypes.String,
  location: db.PropTypes.String,
  price: db.PropTypes.Number,
  unit: db.PropTypes.String,
  desc: db.PropTypes.String,
  images: db.PropTypes.Array,
  tags: db.PropTypes.Array,
  owner: { type: db.PropTypes.Id, ref: 'user' },
  viewed: db.PropTypes.Number,
  liked: db.PropTypes.Number,
  createdAt: db.PropTypes.Date,
  updatedAt: db.PropTypes.Date,
}, {
  middle: {
    create: {
      before (doc) {
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
