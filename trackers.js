const urlParse = require("url").parse;
const dgram = require("dgram");
const crypto = require('crypto');
const torrentParser = require("./torrentParser");
const Buffer = require("buffer").Buffer;

const port = 6681;

exports.getPeers = function(torrent){
	
  const socket = dgram.createSocket('udp4');
  const url  = urlParse(torrent.announce.toString('utf8'));
	console.log(url);
  
  //For retrieving the info property, encoding it again and hashing using SHA1
  /*infoHash = torrent => {
    const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest(); //??
  };
  
  size = torrent => {
    
  };*/
	
	var connReq = buildConnReq();
  console.log(connReq);
  // bloody hostname 
	socket.send(connReq, 0, connReq.length, url.port, url.hostname,(err)=>{console.log(err);});//1

	socket.on('message', (res) => {
		if (respType(res) === 'connect') {
	      
	      const connRes = parseConnRes(res);
	      
	      var announceReq = buildAnnounceReq(connRes.connectionId,torrent);
	      socket.send(announceReq, 0, announceReq.length, url.port, url.hostname,(err)=>{console.log(err);});
    	} 
	    else if (respType(res) === 'announce') {
	      
	      const announceRes = parseAnnounceRes(res);
	      	    
	      console.log(announceRes.peers);
	      return(announceRes.peers);
	  	}

	});
}

function respType(res) {
  //Unsigned Int 32 bits Big Endian format
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
    //can’t read a 64-bit integer, hence it’s easier to just leave it as a buffer.
    connectionId: res.slice(8)
  }
}
//For Client ID
var id = null;
function genId() {
  if (!id) {
    id = Buffer.alloc(20);
    crypto.randomBytes(20).copy(id,0);
    Buffer.from('-AJ1000-').copy(id, 0);
  }
  return id;
};


function buildAnnounceReq(connId,torrent) {
  const message = Buffer.alloc(98);

  // connection id
  connId.copy(message, 0);

  // action
  message.writeUInt32BE(1, 8);

  // transaction id
  crypto.randomBytes(4).copy(message, 12);

  //info hash - need to pass the torrent 
  torrentParser.infoHash(torrent).copy(message, 16);

  //peer id
  genId().copy(message,36);

  //downloaded - 64bit buffer initialized to 0
  Buffer.alloc(8).copy(message, 56);

  // left - need to pass the torrent
  //(torrentParser.size(torrent)).copy(message, 64);

  // uploaded - 64bit buffer initialized to 0
  Buffer.alloc(8).copy(message, 72);

  // event
  message.writeUInt32BE(0, 80);

  // ip address
  message.writeUInt32BE(0, 80);

  // key
  crypto.randomBytes(4).copy(message, 88);

  // num want
  message.writeInt32BE(-1, 92);

  //port
  message.writeUInt16BE(port, 96);

  return message;
}

function parseAnnounceRes(res) {
  
  //break up the address buffer into an array of peers
  function separatePeers(address,size){
    peerList = []
    for(var i=0;i<address.length;i+=6){
      peerList.push({
        ip: address.slice(i,i+4).join('.'),
        port: address.readUInt16BE(i+4)
      });
    }
    console.log(peerList);
    return peerList;
  }
  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    interval: res.readUInt32BE(8),
    leechers: res.readUInt32BE(12),
    seeders: res.readUInt32BE(16),
    peers: separatePeers(res.slice(20),6)
  }
}

