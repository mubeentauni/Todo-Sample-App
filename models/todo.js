let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TodoSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: Number
    },
    status: {
        type: String
    }
});


module.exports = mongoose.model('Todos', TodoSchema);