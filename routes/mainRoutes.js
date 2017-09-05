let express = require('express'),
    request = require('request-promise'),
    router = express.Router()

router.get('/downloadCV', function(req, res){
    res.download('../tzach/public/files/TzachBeinCV.docx');
})


//info shown in navigator, according to user's ip
router.get('/IPStatistics', (req, res) => {

    //ip-to-location api
    request(`http://freegeoip.net/json/${req.headers['x-forwarded-for']}`)
        .then((result) =>{
        const key  = '0b2eab6d97614a90b06104224170109' //weather api key
        let   city = (JSON.parse(result)).city,
              weatherApiCall = `http://api.apixu.com/v1/current.json?key=${key}&q=${city}`

        //making api call - getting statistics
        request(weatherApiCall)
            .then((body)=>{

            let bodyJson = (JSON.parse(body)),
                time = parseInt((bodyJson.location.localtime).substring(11,13))

            if (time < 6 || time > 23){
                time = "Good Night"
            }
            else if (time >= 6 && time <= 12){
                time = "Good Morning"
            }
            else if (time > 12 && time < 18){
                time = "Good Afternoon"
            }
            else {
                time = "Good Evening"
            }

            //creating statistics object
            let ipStatistics = {
                message: time,
                location: `${bodyJson.location.name}, ${bodyJson.location.country}`,
                temperature: bodyJson.current.temp_c,
            }

            //responding with requested data
            res.json(ipStatistics)
            }),(error) =>{
                console.log(`>>>>>>> Error with fetching data from apixu: ${error}`)
            }

        }),(error)=>{
             console.log(`>>>>>>> Error with fetching data from freegoeip: ${error}`)
        }
})

module.exports = router