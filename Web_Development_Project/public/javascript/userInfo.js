const axios = require('axios')

async function getUserInfo() {

     try{
        const response = await axios.get("http://ip-api.com/json/?fields=query,isp")

        if(response && response.data) {
            return response.data
        }

     } catch (error) {
         console.log(error)
     }
}

module.exports = getUserInfo;