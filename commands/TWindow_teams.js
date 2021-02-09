const User = require('../models/User')
const Squads = require('../models/Squad')

module.exports = {
  name: 'teams',
  description: 'Who needs more transfers',
  execute(message, args) {
    Squads.aggregate(
      [
        { $unwind: '$club' },
        // count
        {
          $group: {
            _id: { id: '$doc_id', term: '$club' },
            tf: { $sum: 1 },
          },
        },
        // build array
        {
          $group: {
            _id: '$_id.id',
            term_tf: { $push: { term: '$_id.club', tf: '$tf' } },
          },
        },
        // write to new collection
        { $out: 'sqds' },
      ],
      { allowDiskUse: true }
    )
  },
}
