var mongoose = require("mongoose");

var clientSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    phone: String
})

module.exports = mongoose.model("Client", clientSchema)