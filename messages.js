const Buffer = require("buffer").Buffer;

module.exports.chokeMessage = () => {
	buf = new Buffer(5);
	buf.writeUInt32BE(1,0);
	buf.writeUInt8(0,4);
	return buf;
}

module.exports.unchokeMessage = () => {
	buf = new Buffer(5);
	buf.writeUInt32BE(1,0);
	buf.writeUInt8(1,4);
	return buf;
}

module.exports.interestedMessage = () => {
	buf = new Buffer(5);
	buf.writeUInt32BE(1,0);
	buf.writeUInt8(2,4);
	return buf;
}

module.exports.notinterestedMessage = () => {
	buf = new Buffer(5);
	buf.writeUInt32BE(1,0);
	buf.writeUInt8(3,4);
	return buf;
}

/* bitfield: <len=0001+X><id=5><bitfield> 
The bitfield message may only be sent immediately after the handshaking sequence is completed,
and before any other messages are sent.
It is optional, and need not be sent if a client has no pieces.
The payload is a bitfield representing the pieces that have been successfully downloaded.
Spare bits at the end are set to zero.
*/
module.exports.bitfieldMessage = (payload) => {

}

/* 4-byte message length, 1-byte message ID, and a payload composed of a 4-byte piece index (0 based), 
4-byte block offset within the piece (measured in bytes), and 4-byte block length */
module.exports.requestMessage = (payload) => {
  buf = new Buffer(17);
  // length - does not count the size of length filed itself. hence 13
  buf.writeUInt32BE(13, 0);
  // id
  buf.writeUInt8(6, 4);
  // index
  buf.writeUInt32BE(payload.index, 5);
  // begin
  buf.writeUInt32BE(payload.begin, 9);
  // length
  buf.writeUInt32BE(payload.length, 13);
  return buf;
}

module.exports.cancelMessage = () => {
	buf = new Buffer(17);
    // length
  buf.writeUInt32BE(13, 0);
  // id
  buf.writeUInt8(8, 4);
  // index
  buf.writeUInt32BE(payload.index, 5);
  // begin
  buf.writeUInt32BE(payload.begin, 9);
  // length
  buf.writeUInt32BE(payload.length, 13);
  return buf;	
}

// DHT purposes, currently not being used
module.exports.portMessage = () => {
	
}

module.exports.parse = msg => {

  switch(msg.length) {
    case 1:
        id = msg.readInt8(4);
        break;
    case 13:
        id = msg.readInt8(4);
        break;
    case 13:
    		id = 
    default:
        id = null;
}

  return {
  }
};