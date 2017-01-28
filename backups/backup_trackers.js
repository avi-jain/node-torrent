const urlParse = require("url").parse;
const dgram = require("dgram");
const crypto = require('crypto');

const Buffer = require("buffer").Buffer;

exports.getPeers = function(torrent){
	const url  = urlParse(torrent.announce.toString('utf8'))
	console.log(url);
	const socket = dgram.createSocket('udp4')
	
	var connReq = buildConnReq()
	socket.send(connReq, 0, connReq.length, url.port, url.host,(err)=>{console.log(err);});//1

	socket.on('message', (res) => {
		if (respType(response) === 'connect') {
	      //  receive and parse connect response
	      const connRes = parseConnRes(response);
	      //  send announce request
	      var announceReq = buildAnnounceReq(connRes.connectionId);
	      socket.send(announceReq, 0, announceReq.length, url.port, url.host,(err)=>{console.log(err);});
    	} 
	    else if (respType(response) === 'announce') {
	      // parse announce response
	      const announceRes = parseAnnounceRes(response);
	      // return peers 	    
	      console.log(announceReq.peers);
	      return(announceRes.peers);
	  	}

	});
}

function respType(res) {
  var action = res.readUInt32BE(0);
  if (action === 0) return 'connect';
  if (action === 1) return 'announce';
}

function buildConnReq() {
	message = Buffer.alloc(16)
	message.writeUInt32BE(0x417, 0);
	message.writeUInt32BE(0x27101980, 4);
	crypto.randomBytes(4).copy(message, 12);//3
  	return message;
}

function parseConnRes(res) {
  return{
  	action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    connectionId: res.readUInt32BE(8)
  }
}

function buildAnnounceReq(connId) {
  const message = Buffer.alloc(98);

  // connection id
  connId.copy(message, 0);
  // action
  message.writeUInt32BE(1, 8);
  // transaction id
  crypto.randomBytes(4).copy(message, 12);
  // info hash
  torrentParser.infoHash(torrent).copy(message, 16);
  // peerId
  util.genId().copy(message, 36);
  // downloaded
  Buffer.alloc(8).copy(message, 56);
  // left
  torrentParser.size(torrent).copy(message, 64);
  // uploaded
  Buffer.alloc(8).copy(message, 72);
  // event
  message.writeUInt32BE(0, 80);
  // ip address
  message.writeUInt32BE(0, 80);
  // key
  crypto.randomBytes(4).copy(message, 88);
  // num want
  message.writeInt32BE(-1, 92);
  // port
  message.writeUInt16BE(port, 96);

  return message;
}

function parseAnnounceRes(res) {
  
}