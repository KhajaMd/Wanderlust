const Joi = require('joi');  // Corrected to use consistent capitalization

module.exports.listingSchema_new = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("").optional(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),  // Rating must be between 1 and 5
    comment: Joi.string().required(),
  }).required(),
});