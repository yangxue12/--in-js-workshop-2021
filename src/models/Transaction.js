import sha256 from 'crypto-js/sha256.js'


class Transaction {
  constructor(fromPublicKey,toPublicKey,amount) {
    this.toPublicKey=toPublicKey
    this.fromPublicKey=fromPublicKey
    this.amount=amount
    this.timestamp=new Date().getTime()
    this.hash=this._calculateHash()
  }

  // 更新交易 hash
  _setHash() {
    this.hash=this._calculateHash()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash() {
   return sha256(this.fromPublicKey+this.toPublicKey+this.amount+this.timestamp).toString()
  }
  isValidTransaction () {
    // 验证交易金额是否非负
    if (this.amount <= 0) {
      return false;
    }

    // 验证交易哈希是否正确
    if (this.hash !== this._calculateHash()) {
      return false;
    }

    return true;
  }
}

export default Transaction