let express = require('express'),
    request = require('request-promise'),
    cheerio = require('cheerio'),
    router = express.Router()

//returning list of countries to the browser.
router.get('/showWeather', function(req, res) {
    let baseurl = 'https://www.timeanddate.com/weather/?low=4&sort=1'
    request(baseurl).then(function(html) {
        let $ = cheerio.load(html),
            myData = []

        //first object in the array
        $('tbody').filter(function() {
            let data = {
                country: $(this).children().first().text().split('-')[0],
            }
            myData.push(data)
        })

        //other objects in the array
        $('tbody').find('tr').each(function() {
            if (myData[myData.length - 1].country.split('-')[0] !=
                $(this).children().first().text().split('-')[0]) {
                let data = {
                    country: $(this).
                        children().
                        first().
                        text().
                        split('-')[0],
                }
                myData.push(data)
            }
        })
        res.json(myData)

    }), (error) => {
        console.log(`>>>>>>> Error with scraping countries list: ${error}`)
    }
})

//returning general data regarding specific country.
router.get('/showWeather/:chosenCountry', function(req, res) {
    let countryParam = req.params.chosenCountry,
        baseurl = (`https://www.timeanddate.com/weather/${countryParam}`).replace(
            / +/g, '-')
    request(baseurl).then(function(html) {
        let $ = cheerio.load(html),
            myData = [],
            cities = [],
            capital,
            temperature,
            wind,
            icon

        //Scraping information
        $('#qlook').filter(function() {
            capital = $(this).find('a').first().text()
            temperature = $(this).find('.h2').first().text()
            wind = $(this).children('p').last().text()
            wind = wind.substring((wind.indexOf('Wind:') + 5), wind.length)
            icon = 'https://www.timeanddate.com' +
                $('#cur-weather').attr('src')
        })

        //scraping some more information
        $('tbody').find('tr').each(function() {
            let city = $(this).children().first().text().split('*')[0]
            cities.push(city)
            let status = temperature + wind + icon
            let data = {
                country: req.params.chosenCountry,
                capital: capital,
                city: capital,
                temperature: temperature,
                wind: wind,
                icon: icon,
                status: status,
                cities: cities,
            }
            myData.push(data)
        })

        //sending the scraped data to the browser
        res.json(myData)
    }), (error) => {
        console.log(`>>>>>>> Error with scraping country data: ${error}`)
    }
})

//returning weather data regarding specific city.
router.get('/showWeather/:chosenCountry/:chosenCity', function(req, res) {
    let countryParam = req.params.chosenCountry
    countryParam.split('*')[0]
    countryParam = countryParam.slice(0, -1)
    let cityParam = req.params.chosenCity
    let baseurl = (`https://www.timeanddate.com/weather/${countryParam}/${cityParam}`).replace(
        / /g, '-')

    request(baseurl).then(function(html) {
        let $ = cheerio.load(html)

        //init of variables
        let temperature = '',
            wind = '',
            feels = '',
            icon = '',
            forcast = '',
            humidity = '',
            pressure = '',
            dewPoint = '',
            visibility = '',
            lastUpdate = ''

        //Scraping information
        $('#qlook').filter(function() {
            temperature = $(this).find('.h2').first().text()
            wind = $(this).children('p').last().text()
            wind = wind.substring((wind.indexOf('Wind:') + 5), wind.length)
            feels = $(this).children('p').last().text()
            feels = feels.substring(12, 17)
            icon = 'https://www.timeanddate.com' +
                $('#cur-weather').attr('src')
            forcast = $(this).children('p').last().text()
            forcast = forcast.substring(27, 37)
        })

        //scraping some more information
        $('#qfacts').filter(function() {
            lastUpdate = $(this).find('p:nth-child(3)').first().text()
            lastUpdate = lastUpdate.substring(16, lastUpdate.length)
            visibility = $(this).find('p:nth-child(5)').first().text()
            visibility = visibility.substring(13, visibility.length)
            pressure = $(this).find('p:nth-child(6)').first().text()
            pressure = pressure.substring(11, pressure.length)
            humidity = $(this).find('p:nth-child(7)').first().text()
            humidity = humidity.substring(11, humidity.length)
            dewPoint = $(this).find('p:nth-child(8)').first().text()
            dewPoint = dewPoint.substring(12, dewPoint.length)
        })

        let status = temperature + wind + feels + icon + forcast +
            humidity + pressure + dewPoint + visibility + lastUpdate

        //sending the scraped data to the browser
        let myData = {
            country: countryParam,
            city: cityParam,
            temperature: temperature,
            humidity: humidity,
            visibility: visibility,
            forcast: forcast,
            wind: wind,
            icon: icon,
            feels: feels,
            pressure: pressure,
            dewPoint: dewPoint,
            lastUpdate: lastUpdate,
            status: status,
        }
        res.json(myData)
    }), (error) => {
        console.log(
            `>>>>>>> Error with scraping country and city data: ${error}`)
    }
})

module.exports = router