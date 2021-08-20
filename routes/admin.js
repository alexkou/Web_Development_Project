const express = require('express');
const router = express.Router();

const User = require("../models/user");
// edw prepei na allaksw se admin i epeidi einai usertype o admin menei idio? 

const {isLoggedIn} = require('../middleware');
const getUserInfo = require("../public/javascript/userInfo");

//AUTI ITAN I IDEA MOU ME BASI KAI OSA EIDA APO SENA OTI EINAI ALLAKSE 

// router.get("/admin/timeanalysis", isLoggedIn, (req, res) => {
//     res.render('adminTimeanalysis')
// })

// router.get("/admin/httpanalysis", isLoggedIn, (req, res) => {
//     res.render('adminHTTPanalysis')
// })

// router.get("/admin/datavisualisation", isLoggedIn, (req, res) => {
//     res.render('adminDataVisualisation')
// })
  

//DES AN TO THELEIS AYTO I OXI 

//router.get('/data', isLoggedIn, (req, res) => {
//    res.render('userData')
//})


module.exports = router;