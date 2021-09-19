const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Har = require("../models/har");
const HeatMap = require("../models/heatmap");

const {isLoggedIn, isUser} = require('../middleware');
const getUserInfo = require("../public/javascript/userInfo");
const GeoData = require('../public/javascript/GeoData');

router.get("/", isLoggedIn, isUser, async (req, res) => {

  try {
    const entries = await Har.find({user: req.user._id}).sort({timestamp: -1}).lean()
    const timestamp = entries[0].timestamp;

    const heatMapData = await HeatMap.find({user: req.user._id}, {lat:1, lon:1, intensity:1, _id:0}).lean();

    res.render('userHome', {entries: entries.length, timestamp, heatMapData});


  } catch(error) {
    res.render('userHome');
  }
});

router.get("/profile", isLoggedIn, isUser, (req, res) => {
    res.render('userProfile')
})
  
router.get('/data', isLoggedIn, isUser, (req, res) => {
  res.render('userData')
})

router.post("/passwordUpdate", isLoggedIn, (req, res) => {
    const {current_password, password} = req.body;
    req.user.changePassword(current_password, password, err => {
      if(err) {
        req.flash('error', 'Password is incorrect');
        res.redirect('/user/profile');
      }
      else {
        req.flash('success', 'Successfully changed the password')
        res.redirect('/user');
      }
    })
})

router.post("/usernameUpdate", isLoggedIn, async (req, res) => {
  const {new_username} = req.body;

  const usernameCheck = await User.findOne({username: new_username})

    if(usernameCheck) {
      req.flash('error', 'Username is already in use!');
      res.redirect('/userProfile');
    }
    else {
      const user = await User.findOne({id: req.body._id})
      user.username = new_username;
      await user.save();

      res.redirect('/user');
    }
})
  
router.post('/harUpload', isLoggedIn, async (req, res) => {
    let {harOutput} = req.body;
    json_file = JSON.parse(harOutput);

    const response = await getUserInfo();

    const array=[];
  
    for(let i=0; i<json_file.length; i++) {
      let entry = {user: req.user._id, userIp: response.query, userIsp: response.isp, data: json_file[i]};
        array.push(entry);
    }
    await Har.create(array);

  
    const heatData = await GeoData(json_file)

    const arr=[];

    for (let i=0; i<heatData.length; i++) {
      let entry = {user: req.user._id, ip: heatData[i].query, lat: heatData[i].lat, lon: heatData[i].lon, intensity: heatData[i].intensity};
      arr.push(entry);
    }

    await HeatMap.create(arr);

    req.flash('success', `Successfully uploaded ${json_file.length} HTTP entries`);
    res.redirect('/user')
})
  

module.exports = router;