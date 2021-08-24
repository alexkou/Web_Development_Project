const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Har = require("../models/har");
const HeatMap = require("../models/heatmap");

const {isLoggedIn} = require('../middleware');


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
            avg: contentTypeAvgAge[0].average
        }

        contentTypeArray.push(object)

    }

    res.render('adminHome', {
        num_users, 
        methodObject: methods[0], 
        statusObject: statusObject[0], 
        domains: domains.length, 
        ispObject: ispObject[0],
        contentTypeArray
    });

})

router.get("/timeanalysis", isLoggedIn, (req, res) => {
    res.render('adminTimeanalysis')
})

router.get("/httpanalysis", isLoggedIn, (req, res) => {
    res.render('adminHTTPanalysis')
})

router.get("/datavisualisation", isLoggedIn, (req, res) => {
    res.render('adminDataVisualisation')
})
  

module.exports = router;