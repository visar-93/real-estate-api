const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: false
    },
    neighborhood: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: false
    }
},
{ _id: false});

const roomSchema = new Schema({
    livingRoom: {
        type: Number,
        required: false
    },
    kitchen: {
        type: Number,
        required: false
    },
    bathrooms: {
        type: Number,
        required: false
    },
    bedrooms: {
        type: Number,
        required: false
    },
    depo: {
        type: Number,
        required: false
    },
    balcony: {
        type: Number,
        required: false
    },
    garden_square: {
        type: Number,
        required: false
    }
},
{ _id: false});

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    address: addressSchema,
    rooms: roomSchema,
    furnished: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category_rs: { // rental or for sale
        type: String,
        required: true
    },
    category_usage: { // if it is residential or commercial
        type: String,
        required: true
    },
    property_type: { // based on category_usage is house, parcel, flat, villa, office, bussiness etc
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pictures: [ // it stores pictures of a property
        {
            type: String,
            required: true
        }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
