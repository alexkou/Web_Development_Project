const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Har = require("../models/har");
const HeatMap = require("../models/heatmap");

const {isLoggedIn} = require('../middleware');


router.get("/", isLoggedIn, async (req, res) => {

    const num_users = await User.countDocuments({usertype: 'user'})
    
    res.render('adminHome', {num_users});
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