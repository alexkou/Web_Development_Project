document.getElementById("harInput").onchange = function () {

  var fileInput = document.getElementById("harInput").files;

  var fr = new FileReader();

  fr.readAsText(fileInput.item(0))

  fr.fileName = fileInput.item(0).name

  fr.onload = function (evt) {

      const json = lower(JSON.parse(evt.target.result));

      const startedDateTime = json.log.entries.map(entry => entry.startedDateTime);
      const timings = json.log.entries.map(entry => entry.timings.wait);
      const serverIP = json.log.entries.map(entry => entry.serverIPAddress.replace(/[\[\]']+/g,''));

      const method = json.log.entries.map(entry => entry.request.method);
      const url = json.log.entries.map(entry => entry.request.url);
      const hostname = url.map(entry => new URL(entry).hostname);

      const request_headers = json.log.entries.map(entry => entry.request.headers)

      const status = json.log.entries.map(entry => entry.response.status);
      const statusText = json.log.entries.map(entry => entry.response.statusText);
      const response_headers = json.log.entries.map(entry => entry.response.headers);


      function lower(obj) {
        for (var prop in obj) {
          if (typeof obj[prop] === 'string') {
            obj[prop] = obj[prop].toLowerCase();
          }
          if (typeof obj[prop] === 'object') {
            lower(obj[prop]);
            }
        }
        return obj;
      }

      let array=[];
      for (let i=0; i<json.log.entries.length; i++) {
          array.push({
              date: startedDateTime[i],
              ip: serverIP[i], 
              timing: timings[i], 
              method: method[i],
              url: hostname[i], 
              status: status[i],
              statusText: statusText[i], 
          });
      }

      function headers_extract(header_name,  method) {

          let headers = [];

          for (let i=0; i<json.log.entries.length; i++) {
              for (key of method[i]) {
                  if (key.name === header_name) {
                      headers.push({
                          [header_name] : key.value
                      });
                  }     
              }
          }
          return headers;
      }

      var params = ["content-type", "cache-control", "pragma", "expires", "age", "last-modified", "host"];

      function final_object() {

        let temp_array = [];

        for (let i=0; i<=params.length-1; i++) {
            if (i == params.length-1) {
              temp_array = headers_extract(params[i], request_headers);
            }
            else {
              temp_array = headers_extract(params[i], response_headers);
            }
            array = array.map(t1 => ({...t1, ...temp_array.find(t2 => t2.id === t1.id)}));
        }
        return array;
      }

      let finalData = final_object();

      var json_format = JSON.stringify(finalData,null,2)

      document.getElementById("harOutput").value = json_format;

      document.getElementById("harDownload").onclick = function () {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([json_format], {type: "text/plain"}));
        a.setAttribute("download", (evt.target.fileName).slice(0, -4));
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }









