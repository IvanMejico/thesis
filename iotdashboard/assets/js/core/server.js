var socket = require('socket.io'),
    express = require('express'),
    http = require('http'),
    winston = require('winston'),
    port = 3000;

    // Logger config
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new (winston.transports.Console)(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
});
logger.info('SocketIO > listening on port ' + port);

var app = express(),
    http_server = http.createServer(app)
        .listen(port, function() {
            console.log('listening on *:' + port);
    });

app.get('/', function(req, res) {
    res.send('<h1>Hello!</h1>');
});

function emitNewOrder(http_server) {
    var io = socket.listen(http_server);
    io.sockets.on('connection', function(socket) {
        // Loadlist events
        socket.on('loadlist_update', function(data) {
            console.log('loadlist record updated.');
            io.emit('loadlist_update', data);
        });
        socket.on('loadlist_insert', function(data) {
            console.log('record inserted to loadlist.');
            io.emit('loadlist_insert', data);
        });
        socket.on('loadlist_delete', function(data) {
            console.log('record deleted from loadlist.');
            io.emit('loadlist_delete', data);
        });
        // Battery events
        socket.on('battery_update', function(data) {
            console.log('battery updated');
            io.emit('battery_update', data);
        });

        // Upload events
        socket.on('new_feed', function(data) {
            console.log('Reading uploaded: ', data);
            io.emit('new_feed', data);
        });
        
        socket.on('disconnected', function() {
            console.log('disconnected');
        });
    });
}

emitNewOrder(http_server);
