const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const { number } = require('joi');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.whanauSchema = Joi.object({
    whanau: Joi.object({
        name: Joi.string().required().min(2).escapeHTML(),
        contact: Joi.string().required().escapeHTML(),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        // rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

module.exports.forumSchema = Joi.object({
    forum: Joi.object({
        name: Joi.string().required().min(2).escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.postSchema = Joi.object({
    review: Joi.object({
        // rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})