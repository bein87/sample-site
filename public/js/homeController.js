app.controller('homeController', function($scope,$http){

    $scope.callForActionTabs = false

    ga('send', {
        hitType: 'pageview',
        page: 'home'
    })

    // download from server does not work, will be fixed in next deployment.
    // meanwhile it will download from dropbox.
    $scope.downloadCV = function() {
        ga('send', 'event', 'click', 'CV downloaded', 'Tzach Bein', '1')
    }

    //declaring json obejct to be shown on main page
    let jsonObject = {
        "Personal Info" : {
            "Name" : "Tzach Bein",
            "Address" : "Tel Aviv",
            "Education" : "BS.c Information Systems",
            "GitHub" : "github.com/bein87",
            "Contact" : {
                "Phone" : 546737297,
                "Email" : "bein87@gmail.com"
            },
        },
        "Site Technology" : {
            "Server Side" : "Node.js",
            "Client Side" : "angularJS",
            "Hosting" : "Amazon Web Services",
            "Framework" : "Express",
            "Javascript" : "jQuery",
            "Style" : "Bootstrap",
            "Dev. Tools" : "Gulp + Browsersync + Nodemon",
            "Testing" : "Chai with Mocha",
            "API's" : {
                "Location" : "Google Maps and FreeGeoIP",
                "Analyze" : "Google Analytics",
                "Weather" : "Self-made WebCrawler + Apixu",
                "Typeahead" : "Twitter"
            }
        },
    }

    let jsonStr    = JSON.stringify(jsonObject),
        textIndent = 0

    //style jsonStr with function
    jsonStr = syntaxHighlight(jsonStr)

    //change string to be shown like a json object on DOM, by using rexeg (repeat for each symbol)
    let regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {

        //adding div elemnt with the needed indent
        let rtnFn = function() {
            let indent = (textIndent * 20)
            return `<div style="text-indent: ${indent}px;"> ${p1} </div>`
        }
        let rtnStr = 0

        //if `{` symbol, go down a row and indent 20px more
        if (p1.lastIndexOf('{') === (p1.length - 1)) {
            rtnStr = rtnFn()
            textIndent += 1
        }

        //if `}` symbol, go down a row and indent 20px less
        else if (p1.indexOf('}') === 0) {
            textIndent -= 1
            rtnStr = rtnFn()
        }

        //else - go down a row and continue with same indent
        else {
            rtnStr = rtnFn()
        }

        //adding space before and after :
        rtnStr = rtnStr.replace(/:/g," : ")

        //add the next row if you want to space up quotation marks to 'wider' view
        //rtnStr = rtnStr.replace(/:/g," : ").replace(/"/g,` " `))

        return rtnStr
    })

    //add classes to json, to style each type
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {

            //catagorize by type. first init to number, then check if its other type.
            let cls = 'number'
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key'
                } else {
                    cls = 'string'
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean'
            } else if (/null/.test(match)) {
                cls = 'null'
            }

            //if number, add the class + leading zero
            if (cls =='number'){
                return '<span class="' + cls + '">' + 0 + match + '</span>'
            }

            //else, add the class
            else {
                return '<span class="' + cls + '">' + match + '</span>'
            }
        })
    }

    //add "json" string to homepage DOM
    $('#json').html((regeStr))
    $scope.callForActionTabs = true;
})
