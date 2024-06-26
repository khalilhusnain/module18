const { Schema, model } = require('mongoose');
const reactionsSchema = require('./Reaction');
const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat').default;

const thoughtsSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_lenght: 1,
            max_length: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionsSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

thoughtsSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thoughts = mongoose.model('Thoughts', thoughtsSchema);

module.exports = Thoughts;