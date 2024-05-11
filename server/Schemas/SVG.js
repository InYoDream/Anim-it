const mongoose = require('mongoose');
const { Schema } = mongoose;

const SVGSchema = new Schema({
    data: {
        type: [String],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const SVG = mongoose.model('SVG', SVGSchema);

module.exports = SVG;