const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const server = http.createServer(function(request, response){
    
    let pathObj = url.parse(request.url, true);
    let staticPath = path.resolve(__dirname, 'static');
    let filePath = path.join(staticPath, pathObj.pathname);
    if(filePath.indexOf('favicon.ico') === -1) {
        let fileContent = fs.readFileSync(filePath,'binary');
        response.write(fileContent, 'binary');
    }
    response.end();
});
server.listen(1235);
console.log('static server open at port 1235, url http://localhost:1235');