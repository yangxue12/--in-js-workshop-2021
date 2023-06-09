import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'
export const DIFFICULTY = 2

class Block {
    // 1. 完成构造函数及其参数
    /* 构造函数需要包含
    区块链
    上一个区块的哈希值
    高度
    时间戳
    */
    constructor(blockchain, previousHash, height, timestamp,coinbaseBeneficiary) {
    this.blockchain = blockchain
    this.previousHash = previousHash
    this.height = height
    this.timestamp = timestamp //输出时间戳
    this.hash = this.calculateHash()
    this.nonce=0
    this.utxoPool=new UTXOPool()
    this.coinbaseBeneficiary=coinbaseBeneficiary
    this.transactions=[]
    }
    calculateHash () {
    return sha256(this.nonce+this.previousHash+this.blockchain+this.height+this.timestamp+DIFFICULTY).toString()
    }
    _setHash(){
      this.hash=this.calculateHash()
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
     // 汇总计算交易的 Hash 值
  /**
   * 默克尔树实现
   */
  combinedTransactionsHash() {
    const transactions = this.transactions.map(transaction => transaction.hash);
    if (transactions.length === 0) {
        return sha256('').toString();
    } else if (transactions.length === 1) {
        return transactions[0];
    } else {
        let nodes = transactions;
        while (nodes.length > 1) {
            const parents = [];
            for (let i = 0; i < nodes.length; i += 2) {
                const left = nodes[i]
                const right = i + 1 === nodes.length ? left : nodes[i + 1];
                const parent = sha256(left + right).toString();
                parents.push(parent);
            }
            nodes = parents;
        }
        return nodes[0];
    }
  }

  // 添加交易到区块
  /**
   * 
   * 需包含 UTXOPool 的更新与 hash 的更新
   */
  addTransaction (transaction) {
    if (!transaction.isValidTransaction()) return

    // 处理交易
    this.utxoPool.handleTransaction(transaction)

    // 添加交易到 transactions 数组
    this.transactions.push(transaction)

    // 计算交易 hash
    transaction._setHash()

    // 更新区块的 hash 和 merkleTree
    this.combinedTransactionsHash()
    this._setHash()

  }

}

export default Block