const fs = require("fs");
const bencode = require("bencode");
var trackers = require("./trackers.js");
const torrentParser = require("./torrentParser");

const torrent = torrentParser.open('sample.torrent');
//const torrent = bencode.decode(fs.readFileSync("sample.torrent"));

/*const rawTorrent = fs.readFileSync("sample.torrent");
console.log(rawTorrent);*/

//console.log(torrent.announce);
//console.log(torrent.info);

trackers.getPeers(torrent, peers => {
  console.log("list of peers: ", peers);
});
