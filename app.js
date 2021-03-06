var PORT = 12345;
var HOST = '192.168.1.100';
var dgram = require('dgram');
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app,{ log: false })
  , fs = require('fs')

app.listen(8083);
var server = dgram.createSocket('udp4');
server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});


server.bind(PORT, HOST);

function handler (req, res) {
	if(req.url == "/smoothie.js") {
		fs.readFile(__dirname + '/smoothie.js',
								function (err, data) {
									if (err) {
										res.writeHead(500);
										return res.end('Error loading index.html');
									}

									res.writeHead(200);
									res.end(data);
								});
	} else {
		fs.readFile(__dirname + '/index.html',
								function (err, data) {
									if (err) {
										res.writeHead(500);
										return res.end('Error loading index.html');
									}

									res.writeHead(200);
									res.end(data);
								});
	}
}

io.sockets.on('connection', function (socket) {
    server.on('message', function (message, remote) {
        //  console.log(remote.address + ':' + remote.port +' - ' + message);
          var accel =  {x:0,y:0,z:0};
          accel = JSON.parse(message);
        //  console.log(accel);

          socket.emit("accel",accel);

    });

});

