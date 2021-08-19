const axios = require('axios');

async function GeoData (json_file) {

    obj = {};

    for (let i=0; i < json_file.length; i++) {
        if (obj[json_file[i].ip]) {
          obj[json_file[i].ip] += 1;
        } 
        else if (!obj[json_file[i].ip]){
          obj[json_file[i].ip] = 1;
        }
      }

      delete obj[""]

      let array =  Object.values(obj);
      let min = Math.min(...array)
      let max = Math.max(...array)

      for (let ip in obj) {
          if (obj[ip] === max) {
              obj[ip] = 1
          }
          else if (obj[ip] === min) {
                obj[ip] = 0.1
          }
          else {
              obj[ip] = (((obj[ip] - min) / (max - min)) + 0.1).toFixed(1)
          }
      }

      ips = Object.keys(obj)

      var chunk_array;
      var merge_object = [];

      const url = "http://ip-api.com/batch/?fields=query,lat,lon";

      try {

        for (let i=0; i<ips.length; i+=100) {
            
            chunk_array = ips.slice(i, i+100)
            mydata = JSON.stringify(chunk_array)

            const response = await axios({method: 'post',  url, data: mydata})

            if (response && response.data) {

                for (let j=0; j<response.data.length; j++) {
                    for (ip in obj) {
                        if (ip == response.data[j].query) {
                            response.data[j]["intensity"] = parseFloat(obj[ip]);
                        }
                    }
                }

                merge_object = merge_object.concat(response.data);

              }
        }

        return merge_object;

      } catch (error) {
            console.log(error)
      }
      
}

module.exports = GeoData;
