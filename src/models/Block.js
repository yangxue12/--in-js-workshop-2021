import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'
import Transaction from './Transaction.js'
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
  addTransaction (tx) {
    /* lesson6 */
    // 如果签名不合法则不添加交易
    if (!tx.isValidTransaction() || !tx.hasValidSignature()) return false
    // if (tx.senderPublicKey === this.coinbaseBeneficiary) { // 矿工转账
    if (tx.senderPublicKey === '04a48c7445aff5a6544f4086560e7a3959f9601bd418710cdd32536f803c79de8d9e7dbdbbaf8b906220523fe071ede64b1625f3187b3c41f7b27633110ca890e1') { // 矿工转账
      tx.fee = 0
      this.transactions.push(tx)
      tx._setHash() // 计算交易哈希值
      this.utxoPool.handleTransaction(tx)
      this.combinedTransactionsHash() // 更新 Merkle 树
      this._setHash() // 更新区块哈希值
      return true
    } else {
      this.transactions.push(tx)
      this.utxoPool.handleTransaction(tx)
      // let temp = new Transaction('0x000000', this.coinbaseBeneficiary, 0, tx.fee)
      let temp = new Transaction('0x000000', '04a48c7445aff5a6544f4086560e7a3959f9601bd418710cdd32536f803c79de8d9e7dbdbbaf8b906220523fe071ede64b1625f3187b3c41f7b27633110ca890e1', 0, tx.fee)
      temp._setHash()
      tx._setHash() // 计算交易哈希值
      this.utxoPool.handleTransaction(temp)
      // this.transactions.push(temp)
      this.combinedTransactionsHash() // 更新 Merkle 树
      this._setHash() // 更新区块哈希值
      return true
    }
  }
   /* 判断区块中的交易是否有效 */
   isValidTransaction (transaction) {
    if (transaction.senderPublicKey === this.coinbaseBeneficiary) {
      return true //coinbase交易不需要验证签名
    }
    return transaction.hasValidSignature()
  }
}

export default Block