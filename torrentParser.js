const fs = require("fs");
const bencode = require("bencode");
//In case of torrent size being larger than 32 bits
//Not being used at this stage
//const bignum = require("bignum");
const crypto = require("crypto");
const Buffer = require("buffer").Buffer;

module.exports.open = (filepath) => {
  return bencode.decode(fs.readFileSync(filepath));
};

//Needs access to decoded torrent
module.exports.size = torrent => {
	buffer = new Buffer(8);
	if(torrent.info.files){
		size = 0;
		for(i=0;i<torrent.info.files.length;i++){
			size += torrent.info.files[i].length
		}
		return buffer.writeUInt32BE(size,0);
	}
	else{
		return buffer.writeUInt32BE(torrent.info.length,0);
	}
};

module.exports.infoHash = torrent => {
	const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
};