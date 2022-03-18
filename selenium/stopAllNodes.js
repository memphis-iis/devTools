const gridHubURL = "iis-server.uom.memphis.edu"
const http = require('http')
const exec = require('child_process').exec;

const optionsGET = {
  hostname: gridHubURL,
  port: 4444,
  path: '/status',
  method: 'GET'
}

const req = http.request(optionsGET, res => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            for(node of json.value.nodes){
                nodeURI = node.uri;
                for(slot of node.slots){
                    if(slot.session != null) {
                        let sessionId = slot.session.sessionId;
                        console.log(`curl --request DELETE '${nodeURI}/se/grid/node/session/${sessionId}' --header 'X-REGISTRATION-SECRET;'`)
                        exec(`curl --request DELETE '${nodeURI}/se/grid/node/session/${sessionId}' --header 'X-REGISTRATION-SECRET;'`)
                    }
                }
            }
        } catch (error) {
            console.error(error.message);
        };
    });
})

req.on('error', error => {
  console.error(error)
})

req.end()
