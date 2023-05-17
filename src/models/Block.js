
import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2

class Block {
// 1. 完成构造函数及其参数
/* 构造函数需要包含
区块链
上一个区块的哈希值
高度
时间戳
*/
constructor(blockchain, previousHash, height, timestamp) {
this.blockchain = blockchain
this.previousHash = previousHash
this.height = height
this.timestamp = timestamp //输出时间戳
this.hash = this.calculateHash()
this.nonce=0
}
calculateHash () {
return sha256(this.nonce+this.previousHash+this.blockchain+this.height+this.timestamp+DIFFICULTY).toString()
}

/* 验证当前区块是否有效 */
isValid () {
//是否满足难度值
if (this.calculateHash().substring(0,DIFFICULTY) == Array(DIFFICULTY+1).join("0")) {
return true
}
}

setNonce(nonce) {
this.nonce++
return this.hash=sha256(this.nonce+nonce+this.previousHash+this.blockchain+this.height+this.timestamp+DIFFICULTY).toString()
}
}

export default Block