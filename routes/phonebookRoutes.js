let express = require('express'),
    router = express.Router(),
    Client = require('../models/client')

//get all clients
router.get('/phonebook/clients', (req, res) => {
    Client.find({}).then((clientsData) => {
        res.json({clients: clientsData})
    }),
        (error) => {
            console.log('db error!' + error)
        }
})

//add new client
router.post('/phonebook/clients/addClient', (req, res) => {
    Client.create({
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    }).then((success) => {
        res.send(success)
    }),
        (error) => {
            res.send(error)
            console.log(`>>>>>>> Error with creating new client on DB: ${error}`)
        }
})

//edit specific client
router.put('/phonebook/clients/editClient', (req, res) => {
    Client.findByIdAndUpdate(req.body._id, {
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    }).then((success) => {
        res.send(success)
    }),
        (error) => {
            console.log(`>>>>>>> Error with editing client DB: ${error}`)
        }
})

//remove specific client
router.delete('/phonebook/clients/:id', (req, res) => {
    Client.findByIdAndRemove(req.params.id).then((success) => {
        res.send(success)
    }),
        (error) => {
            console.log(`>>>>>>> Error with removing client from DB: ${error}`)
        }
})

module.exports = router