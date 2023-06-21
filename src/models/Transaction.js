import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'
import { generatePair, sign, verifySignature } from '../crypto.js'
class Transaction {
  constructor(senderPublicKey, receiverPublicKey, amount, fee, signature = ' ') {
    this.senderPublicKey = senderPublicKey
    this.receiverPublicKey = receiverPublicKey
    this.amount = amount
    this.timestamp = new Date().getTime()
    this.fee = fee
    this.setHash = () => {
      this.hash = this._calculateHash()
    }
    this.setHash()
    this.signature = signature
  }

  // 更新交易 hash
  _setHash () {
    this.hash = this._calculateHash()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash () {
    return sha256(
      this.fee +
      this.senderPublicKey +
      this.receiverPublicKey +
      this.amount
      // this.timestamp //不加时间戳就没事了
      // this.signature
    ).toString()
  }

  // 验证交易是否有效
  isValidTransaction () {
    // 检查发件人地址是否为空
    if (!this.senderPublicKey) {
      return false;
    }
    // 检查接收者地址是否为空
    if (!this.receiverPublicKey) {
      return false;
    }
    // 验证交易金额是否非负
    if (this.amount < 0 || this.fee + this.amount < 0) { // 新增对fee属性的非负判断
      return false;
    }
    // 验证交易哈希是否正确
    if (this.hash !== this._calculateHash()) {
      return false;
    }
    return true;
  }

  // 校验交易签名 返回 bool 类型的值
  hasValidSignature () {
    const signature = this.signature
    if (!signature) {
      console.log("签名为空");
      return false
    }
    return verifySignature(this.hash, this.signature, this.senderPublicKey)
  }
}

export default Transaction