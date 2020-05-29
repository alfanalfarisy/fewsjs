const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
   endpoint: String,
   keys: Schema.Types.Mixed,
   createDate: {
       type: Date,
       default: Date.now
   }
});

var Subscribers = mongoose.model('Subscribers', SubscriberSchema, 'subscribers');

module.exports = Subscribers;