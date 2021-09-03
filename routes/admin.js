const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Har = require("../models/har");
const HeatMap = require("../models/heatmap");

const {isLoggedIn} = require('../middleware');


router.get("/", async (req, res) => {

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
        contentTypeArray
    });

})

router.get("/timeanalysis", async (req, res) => {

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

router.get("/datavisualisation", (req, res) => {
    
    res.render('adminDataVisualisation')
})
  

module.exports = router;