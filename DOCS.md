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

While calculating torrent size, there are two cases we have to consider - torrents that have one file or more than one file. If the torrent only has one file then we can get it’s size in the torrent.info.length property. But if it has multiple files, it will have a torrent.info.files property instead which is an array of objects for each file. We have to iterate over these file objects and sum their length property.