
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

  }

  calculateHash () {
    return sha256(this.previousHash, this.timestamp).toString()
  }
}
export default Block