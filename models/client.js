var mongoose = require("mongoose");

var clientSchema = new mongoose.Schema({
    id: Number,
    name: String,
    address: String,
    phone: Number
})

module.exports = mongoose.model("Client", clientSchema)