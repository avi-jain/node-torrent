_dgram send()_ -> socket.send(msg, [offset, length,] port, address[, callback])

_rinfo_ -> object with the sender's address information provided -> address family port:

_Buffer copy()_ -> buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
buf.writeUInt32BE(value, offset[, noAssert])#

buf.writeUInt32LE(value, offset[, noAssert])
buf.writeUInt32BE(value, offset[, noAssert])

value <Integer> Number to be written to buf
offset <Integer> Where to start writing. Must satisfy: 0 <= offset <= buf.length - 4
noAssert <Boolean> Skip value and offset validation? Default: false
Return: <Integer> offset plus the number of bytes written

####The format of the connreq is made so because each hexadecimal represents 4 bits and node cannot handle precise 64 bit ints.

####The number of addresses returned in the announce response is not constant.

While calculating torrent size, there are two cases we have to consider - is it one file or more than one file. If the torrent only has one file then we can get it’s size in the torrent.info.length property. But if it has multiple files, it will have a torrent.info.files property instead which is an array of objects for each file. We have to iterate over these file objects and sum their length property.

The tcp interface is very similar to using udp, but you have to call the connect method to create a connection before sending any messages. Also it’s possible for the connection to fail, in which case we don’t want the program to crash so we catch the error with socket.on('error', console.log).

Once a tcp connection is established the messages you send and receive have to follow the following protocol.

The “handshake” - The handshake is a required message and must be the first message transmitted by the client. It is (49+len(pstr)) bytes long. If the peers don’t have the files you want(identified by the info_hash) they'll close the connection.

Then the remaining peers will let you know what pieces they have. This happens through the “have” and “bitfield” messages. Each “have” message contains a piece index as its payload. This means you will receive multiple have messages, one for each piece that your peer has.

The bitfield message serves a similar purpose, but does it in a different way. The bitfield message can tell you all the pieces that the peer has in just one message. It does this by sending a string of bits, one for each piece in the file. The index of each bit is the same as the piece index, and if they have that piece it will be set to 1, if not it will be set to 0. For example if you receive a bitfield that starts with 011001… that means they have the pieces at index 1, 2, and 5, but not the pieces at index 0, 3,and 4.

It’s possible to receive both “have” messages and a bitfield message, if which case you should combine them to get the full list of pieces.

Actually it’s possible to recieve another kind of message, the peer might decide they don’t want to share with you :/ You're choked.

choke: `<len=0001><id=0>`
The choke message is fixed-length and has no payload.

unchoke: `<len=0001><id=1>`
The unchoke message is fixed-length and has no payload.

interested: `<len=0001><id=2>`
The interested message is fixed-length and has no payload.

not interested: `<len=0001><id=3>`

The not interested message is fixed-length and has no payload.
You always start out choked and not interested. So the first message you send should be the interested message. Then hopefully they will send you an unchoke message and you can move to the next step. If you receive a choke message message instead you can just let the connection drop.

At this point you’re ready start requesting. You can do this by sending “request” messages, which contains the index of the piece that you want (more details on this in the next section).

Finally you will receive a piece message, which will contain the bytes of data that you requested.


References - 
[Bittorrent Protocol Wiki](https://wiki.theory.org/BitTorrentSpecification#Handshake)
[Bittorrent](http://www.bittorrent.org/beps/bep_0003.html)
[Blog post - kristenwidman](http://www.kristenwidman.com/blog/71/how-to-write-a-bittorrent-client-part-2)