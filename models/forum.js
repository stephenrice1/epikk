//This file sets up the mongoose schema for the discussion forum data
const mongoose = require('mongoose');
const { forumSchema } = require('../schemas');
const forum = require('./forum');
const Schema = mongoose.Schema;

const opts = { toJSON: {virtuals: true} };

const ForumSchema = new Schema({
    name: String,
    description: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, opts);

ForumSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/forums/${this._id}">${this.name}</a><strong>
    <p>${this.location.substring(0, 30)}...</p>
    `
});

ForumSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await post.deleteMany({
            _id: {
                $in: doc.posts
            }
        })

    }
})

module.exports = mongoose.model('Forum', ForumSchema);

