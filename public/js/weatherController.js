app.controller('weatherController', function($scope, $http) {

    ga('send', {
        hitType: 'pageview',
        page: 'weather'
    })

    // Animate loader
    $scope.isStatisticsReady = false
    $scope.isPageReady = false

    $scope.showCapitalInfo = (country) => {
        $scope.isPageReady = false;
        //init of variables [deleting old data for previous requested country]
        $scope.capital = ''
        $scope.temperature = ''
        $scope.wind = ''
        $scope.icon = ''
        $scope.humidity = ''
        $scope.forcast = ''
        $scope.feels = ''
        $scope.visibility = ''
        $scope.pressure = ''
        $scope.dewPoint = ''
        $scope.lastUpdate = ''
        $scope.cities = []

        //requesting data from server and copying it to scope
        $http.get(`/showWeather/${country}`).then((result) => {

                const returnedData = result.data[0]
                $scope.country = country
                $scope.city = returnedData.capital
                $scope.capital = returnedData.capital
                $scope.temperature = returnedData.temperature
                $scope.wind = returnedData.wind
                $scope.icon = returnedData.icon
                $scope.status = returnedData.status
                angular.extend($scope.cities, returnedData.cities)
                $('html,body').scrollTop(0)
                $scope.isStatisticsReady = true
                $scope.isPageReady = true
                $scope.isCountrySelected = false

            },
            (err) => {
                console.log(err)
            })
    }

//
    $scope.showCityWeather = (city, country) => {
        $scope.isPageReady = false;

        //init of variables [deleting old data for previous requested city]
        $scope.temperature = ''
        $scope.wind = ''
        $scope.humidity = ''
        $scope.forcast = ''
        $scope.wind = ''
        $scope.feels = ''
        $scope.visibility = ''
        $scope.pressure = ''
        $scope.dewPoint = ''
        $scope.lastUpdate = ''
        $scope.icon = ''

        //requesting data from server and copying it to scope
        $http.get(`/showWeather/${country}/${city}`).then((result) => {
                const returnedData = result.data
                $scope.country = country
                $scope.city = city
                $scope.temperature = returnedData.temperature
                $scope.humidity = returnedData.humidity
                $scope.forcast = returnedData.forcast
                $scope.wind = returnedData.wind
                $scope.icon = returnedData.icon
                $scope.feels = returnedData.feels
                $scope.visibility = returnedData.visibility
                $scope.pressure = returnedData.pressure
                $scope.dewPoint = returnedData.dewPoint
                $scope.lastUpdate = returnedData.lastUpdate
                $scope.status = returnedData.status
                $scope.isPageReady = true;
                $('html,body').scrollTop(0)
            },
            function(err) {
                console.log(err)
            })
    }

//requesting countries data from server
    $http.get('/showWeather').then(function(result) {
        $scope.countries = result.data
        $scope.isPageReady = true
        //live search filter
        let substringMatcher = function(strs) {
            return function findMatches(q, cb) {
                // an array that will be populated with substring matches
                let matches = [],
                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i')
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                    if (substrRegex.test(str)) {
                        matches.push(str)
                    }
                })
                cb(matches)
            }
        }
        let countries = []
        for (let i = 0; i < result.data.length; i++) {
            countries.push(result.data[i].country)
        }
        $('#the-basics .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1,
            },
            {
                name: 'countries',
                source: substringMatcher(countries),
            })

        // constructs the suggestion engine
        countries = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `countries` is an array of state names defined in "The Basics"
            local: countries,
        })
        $('#bloodhound .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1,
            },
            {
                name: 'countries',
                source: countries,
            })

        $scope.isCountrySelected = true;

    })

        , function(err) {
        console.log(err)
    }

})
