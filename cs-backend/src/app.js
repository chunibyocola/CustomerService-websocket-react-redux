const WebSocketServer = require('websocket').server;
const http = require('http');
const msgDispatcher = require('./controller');
const UserToken = require('./model/UserToken');
let pendingCsUserList = require('./constants/CsList').pendingCsUserList;
let waitingCsUserList = require('./constants/CsList').waitingCsUserList;
let chattingCsUserList = require('./constants/CsList').chattingCsUserList;
let staffConnectionsList = require('./constants/CsList').staffConnectionsList;
const results = require('./controller/results');
 
const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
const port = 1234;
server.listen(port, function() {
    console.log((new Date()) + ` Server is listening on port ${ port }`);
});
 
let wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    let connection = request.accept('echo-protocol', request.origin);
    connection.userToken = new UserToken();
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            try {
                msgDispatcher(message.utf8Data, connection);
            }
            catch (err) {
                connection.sendUTF(err);
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        clientDisconnect(connection);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

const clientDisconnect = (connection) => {
    let { userToken } = connection;
    if (!userToken.getLoggedIn()) {
        return;
    }
    if (userToken.getIsStaff()) {
        staffDisconnect(connection);
    }
    else {
        customerDisconnect(connection);
    }
};

const staffDisconnect = (connection) => {
    let { userToken } = connection;
    let staffId = userToken.getUser().getUserId();
    let csUsers = chattingCsUserList.getCsUsersByStaffId(staffId);
    csUsers.map((value) => {
        chattingCsUserList.removeCsUser(value);
        value.getCustomerConnections().map((item) => {
            item.sendUTF(results.csChatEndResult());
        });
        value.cleanToPending();
        pendingCsUserList.addCsUser(value);
    });
    let index = staffConnectionsList.indexOf(connection);
    if (index >= 0) {
        staffConnectionsList.splice(index, 1);
    }
};

const customerDisconnect = (connection) => {
    let { userToken } = connection;
    let customerId = userToken.getUser().getUserId();

    let csUser = pendingCsUserList.getCsUser(customerId);
    if (csUser) {
        csUser.removeOneCustomerConnection(connection);
        if (csUser.getCustomerConnections().length === 0) {
            pendingCsUserList.removeCsUser(csUser);
        }
    }

    csUser = waitingCsUserList.getCsUser(customerId);
    if (csUser) {
        csUser.removeOneCustomerConnection(connection);
        if (csUser.getCustomerConnections().length === 0) {
            waitingCsUserList.removeCsUser(csUser);
        }
    }

    csUser = chattingCsUserList.getCsUser(customerId);
    if (csUser) {
        csUser.removeOneCustomerConnection(connection);
    }
};