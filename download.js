const net = require("net");
const Buffer = require("buffer").Buffer;
const tracker = require("./trackers");
const messages = require("./messages");

function download(peer,torrent) {
  const socket = net.Socket();
  socket.on('error', console.log);
  socket.connect(peer.port, peer.ip, () => {
    // socket.write(...) write a message here
  });
  socket.on('data', data => {
    // handle response here
  });
}