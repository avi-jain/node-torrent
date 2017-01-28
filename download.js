const net = require('net');
const Buffer = require('buffer').Buffer;

function download(peer) {
  const socket = net.Socket();
  socket.on('error', console.log);
  socket.connect(peer.port, peer.ip, () => {
    // socket.write(...) write a message here
  });
  socket.on('data', data => {
    // handle response here
  });
}