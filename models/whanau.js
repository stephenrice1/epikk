//This file sets up the mongoose schema for the whanau data
const mongoose = require('mongoose');
const { whanauSchema } = require('../schemas');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: {virtuals: true} };

const WhanauSchema = new Schema({
    name: String,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
            },
        coordinates: {
            type: [Number],
            required: true
            }
        },
    contact: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

WhanauSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/whanaus/${this._id}">${this.name}</a><strong>
    <p>${this.location.substring(0, 30)}...</p>
    `
});

WhanauSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

    }
})

module.exports = mongoose.model('Whanau', WhanauSchema);

