const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Har = require("../models/har");
const HeatMap = require("../models/heatmap");

const {isLoggedIn} = require('../middleware');
const { default: axios } = require('axios');


router.get("/", isLoggedIn, async (req, res) => {

    const num_users = await User.countDocuments({usertype: 'user'}).lean()

    const methods = await Har.aggregate([
        {"$group": 
            {
                "_id":  "$data.method",
                "count": { "$sum": 1}
            } 
        },
        {"$group": 
            {
                "_id": null,
                "counts": 
                {
                    "$push": 
                    {
                        "k": "$_id", 
                        "v": "$count"
                    }
                }
            } 
        }, 
        { "$replaceRoot": 
            {
                "newRoot": { "$arrayToObject": "$counts"}
            }
        }
    ]);

    const statusObject = await Har.aggregate([
        {"$group": 
            {
                "_id":  "$data.status",
                "count": { "$sum": 1}
            } 
        },
        {"$group": 
            {
                "_id": null,
                "counts": 
                {
                    "$push": 
                    {
                        "k": "$_id", 
                        "v": "$count"
                    }
                }
            } 
        }, 
        { "$replaceRoot": 
            {
                "newRoot": { "$arrayToObject": "$counts"}
            }
        }
    ]);

    const domains = await Har.distinct("data.url").lean();

    const ispObject = await Har.aggregate([
        {"$group": 
            {
                "_id":  "$userIsp",
                "count": { "$sum": 1}
            } 
        },
        {"$group": 
            {
                "_id": null,
                "counts": 
                {
                    "$push": 
                    {
                        "k": "$_id", 
                        "v": "$count"
                    }
                }
            } 
        }, 
        { "$replaceRoot": 
            {
                "newRoot": { "$arrayToObject": "$counts"}
            }
        }
    ]);


    let contentTypeArray = [];

    const content_type = await Har.distinct("data.contenttype").lean()

    for (let i=0; i<content_type.length; i++) {
        
        let contentTypeAvgAge = await Har.aggregate ([
            {
                "$match": {
                    "data.contenttype": content_type[i]
                }
            },

            {
                "$group": {
                    "_id": content_type[i],
                    "average": {"$avg": {"$toInt": "$data.age"}}
                }
            }

        ]);

        let object = {
            type: content_type[i], 
            avg: parseInt(contentTypeAvgAge[0].average)
        }

        contentTypeArray.push(object)

    }


    res.render('adminHome', {
        num_users, 
        methodObject: JSON.stringify(methods[0]), 
        statusObject: JSON.stringify(statusObject[0]), 
        domains: domains.length, 
        ispObject: JSON.stringify(ispObject[0]),
        contentTypeArray: JSON.stringify(contentTypeArray)
    });

})

router.get("/timeanalysis", isLoggedIn, async (req, res) => {

    const isp = await Har.distinct("userIsp").lean()
    const http_methods = await Har.distinct("data.method").lean()
    const content_type = await Har.distinct("data.contenttype").lean()
    const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];


    async function timings_agg(data, field) {

        let query = {}

        let timingsArray = [];
    
        for(let i=0; i<data.length; i++) {

            query[field] = data[i];
    
            let timingsAvg = await Har.aggregate([
            {
                "$match": query
            },
    
            {"$group": 
                {
                    "_id": {"$hour": "$data.date"},
                    "hour": {"$avg": "$data.timing"}, 
                    "count": { "$sum": 1}
                } 
            },
            {"$group": 
                {
                    "_id": null,
                    "counts": 
                    {
                        "$push": 
                        {
                            "k": {"$toString": "$_id"}, 
                            "v": {"avg": "$hour", "count": "$count"}, 
                        }
                    }
                } 
            }, 
            { "$replaceRoot": 
                {
                    "newRoot": { "$arrayToObject": "$counts"}
                }
            }
        ]);
    
            let object = {
                data: data[i],
                avgTiming: timingsAvg[0]
            }
    
            timingsArray.push(object)
        }
    
        return timingsArray;
    }

    const ispTimings = await timings_agg(isp, 'userIsp')
    const methodTimings = await timings_agg(http_methods, 'data.method')
    const contentTimings = await timings_agg(content_type, 'data.contenttype')

    const dayTimings = await Har.aggregate([
        {
            "$group": {
                "_id": {
                    "day": { "$dayOfWeek": "$data.date"}, 
                    "hour": { "$hour": "$data.date"}
                },
                "avgTiming": {"$avg": "$data.timing"}
            }
        },

        {
            "$group": {
                "_id": null,
                "counts": 
                {
                    "$push": 
                    {
                        "k": {"$toString": "$_id.hour"}, 
                        "v": {"day": "$_id.day", "avgTiming": "$avgTiming"}
                    }
                }
            } 
        }, 
        
        { "$replaceRoot": 
            {
                "newRoot": { "$arrayToObject": "$counts"}
            }
        }
    ])
    
    // console.log(dayTimings)

    res.render('adminTimeanalysis',  {
        isp, 
        http_methods, 
        content_type, 
        days, 
        ispTimings: JSON.stringify(ispTimings), 
        methodTimings: JSON.stringify(methodTimings), 
        contentTimings: JSON.stringify(contentTimings),
        dayTimings: JSON.stringify(dayTimings)})
})

router.get("/httpanalysis", isLoggedIn, (req, res) => {
    res.render('adminHTTPanalysis')
})

router.get("/datavisualisation", isLoggedIn, async (req, res) => {
    
    let userIps = await Har.distinct('userIp')
    let usersLatLong;

    let userIp_Id = await Har.aggregate([
        {"$group": 
            {
                "_id": 
                {
                    "ip": "$userIp", 
                    "id":"$user"
                 }
            }
        }, 

        {"$group": 
        {
            "_id": null,
            "counts": 
            {
                "$push": 
                {
                    "k": "$_id.ip", 
                    "v": "$_id.id"
                }
            }
        } 
    }, 

    { "$replaceRoot": 
        {
            "newRoot": { "$arrayToObject": "$counts"}
        }
    }
]);


    try {
        const response = await axios({method: 'post',  url: "http://ip-api.com/batch/?fields=query,lat,lon", data: userIps})
        usersLatLong = response.data

    } catch (error) {
        console.log(error)
    }


    let my_object = userIp_Id[0];
    let key_array = Object.keys(my_object);


    for(let i=0; i<key_array.length; i++) {
        for(let j=0; j<usersLatLong.length; j++) {
            if(key_array[i] == usersLatLong[j].query) {
                usersLatLong[j].id = my_object[usersLatLong[j].query]
                delete usersLatLong[j].query
            }
        }
    } 

    let userIds = await User.find({usertype: 'user'}, {_id: 1, username:1})
    
    let requestIps = [];

    for (let i=0; i<userIds.length; i++) {
        requestIps[i] = await HeatMap.find({user: Object(`${userIds[i]._id}`)}, {lat:1, lon:1, intensity:1, user:1 ,_id:0 })
    }


    res.render('adminDataVisualisation', {userIds, usersLatLong: JSON.stringify(usersLatLong), requestIps: JSON.stringify(requestIps)})
})
  

module.exports = router;