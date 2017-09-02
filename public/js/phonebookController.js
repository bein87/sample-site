app.controller('phonebookController', function($scope, phonebookService) {

    ga('send', {
        hitType: 'pageview',
        page: 'phonebook'
    })

    // Animate loader
    $scope.isPageReady = false

    $(document).ready(function() {
        //init new client form after closing dialog
        $('.modal').on('hidden.bs.modal', function() {
            $scope.newClient.id = ""
            $scope.newClient.name = ""
            $scope.newClient.address = ""
            $scope.newClient.phone = ""
        })
        //focus first input when opening modal
        $('.modal').on('shown.bs.modal', function() {
            $('#newClientID').focus()
        })
        // Animate loader off when page finished loading up
        $scope.isPageReady = true
    })

    //deleteButton appearance
    $scope.hoverIn = function() {
        this.hoverEdit = true
        $('.deleteButton').append('<img src="/images/delete.png"').fadeIn(800)
    }
    $scope.hoverOut = function() {
        this.hoverEdit = false
        $('.deleteButton').fadeOut()
    }

    //get request - get all clients
    phonebookService.getData().then(function(response) {
        $scope.clients = response.data.clients
    })

    //post request - add client
    $scope.addClient = function(newClient) {
        phonebookService.postDataAdd(newClient, $scope)
    }

    //post request - edit client
    $scope.editClient = function(client) {
        phonebookService.postDataEdit(client)
    }

    //post request - remove client
    $scope.removeClient = function(id, list, index) {
        phonebookService.postDataRemove(id, list, index)
    }
})

app.service('phonebookService', function($http) {

    //showing alert with action result
    let setResponseAlert = function(message1, message2) {
        $('#result').
            append(
                `<div class="responseAlert">${message1}<br> ${message2}</div>`).
            fadeIn().
            delay(2000).
            fadeOut(800)
    }

    this.getData = function() {
        return $http.get('/phonebook/clients').then(function(response) {
            return response
        })
    }

    this.postDataAdd = function(newClient, $scope) {
        return $http.post('/phonebook/clients/addClient', newClient).then(function() {
            //add new client to scope
            let addedClient = {
                id: newClient.id,
                    name: newClient.name,
                address: newClient.address,
                phone: newClient.phone
            }
            $scope.clients.push(addedClient)
            $('#newClientModal').modal('hide')
            setResponseAlert('Client', 'Added')

        }), function(error) {
            setResponseAlert('Failed to', 'Add Client')
            console.log(error)
        }
    }

    this.postDataEdit = function(client) {
        return $http.put('/phonebook/clients/editClient', {
            _id: client._id,
            id: client.id,
            name: client.name,
            address: client.address,
            phone: client.phone
        }).then(function() {
            setResponseAlert('Client', 'Edited')
        }), function(error) {
            setResponseAlert('Failed to', 'Edit Client')
            console.log(error)
        }
    }

    this.postDataRemove = function(client, list, index) {
        return $http.delete(`/phonebook/clients/${client._id}`).
            then(function(response) {
                if (response.data != '') {
                    list.splice(index, 1)
                    setResponseAlert('Client', 'Deleted')
                }
                else {
                    setResponseAlert('Client Already', 'Deleted')
                    console.log('already  deleted')
                }
            }), function(error) {
            console.log(error)
        }
    }

})
