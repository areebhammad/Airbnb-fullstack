const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: [String],
    checkIn: Number,
    checkOut: Number,
    maxGuest: Number,
})


//place is the variable and we are assigning placeSchema to that variable
const placeModel = mongoose.model('place', placeSchema);

module.exports = placeModel;