app.controller('locationController', function($scope, $http){

    ga('send', {
        hitType: 'pageview',
        page: 'location'
    })

    //google maps api configuration
    let placeSearch, autocomplete
    $scope.initAutocomplete = function() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete()

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', function(){
            $scope.lat = autocomplete.getPlace().geometry.location.lat()
            $scope.lng = autocomplete.getPlace().geometry.location.lng()
        })

    }

    $scope.fillInAddress = function() {
        // Get the place details from the autocomplete object.
        let place = autocomplete.getPlace()

        for (let component in componentForm) {
            document.getElementById(component).value = ''
            document.getElementById(component).disabled = false
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (let i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0]
            if (componentForm[addressType]) {
                let val = place.address_components[i][componentForm[addressType]]
                document.getElementById(addressType).value = val
            }
        }
    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    $scope.geolocate = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                let circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                })
                autocomplete.setBounds(circle.getBounds())
            })
        }
    }

    //map div configuration
    let map,
        infoWindow
    function initMap() {
        map = new google.maps.Map(document.getElementById('googleMap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 14
        })
        infoWindow = new google.maps.InfoWindow

        // Create the search box and link it to the UI element.
        let input = document.getElementById('pac-input');
        let searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        let markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            let places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            let bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return
                }
                let icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                }

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }))

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport)
                } else {
                    bounds.extend(place.geometry.location)
                }
            })
            map.fitBounds(bounds)
        })
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                let image = './images/anchor.png'

                let currentLocationMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: image
                })

                let lowerPos = {
                    lat: position.coords.latitude+0.002 ,
                    lng: position.coords.longitude
                }
                map.setCenter(lowerPos)
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter())
            })
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter())
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos)
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.')
        infoWindow.open(map)
    }

    $('document').ready(function() {
        initMap()

        $scope.initAutocomplete()
    })
})
