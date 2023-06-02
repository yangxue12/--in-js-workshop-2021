import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos=utxos
  }

  addUTXO(publicKey, amount) {
    if(this.utxos[publicKey]){//如果该账户已存在则交易叠加
      this.utxos[publicKey].amount+=amount
  }else{
      const u=new UTXO(amount)
      this.utxos[publicKey]=u
  }
  }

  clone() {
    return new UTXOPool(this.utxos)
  }

  // 处理交易函数
  handleTransaction(transaction) {
    let fromPublicKey = transaction.fromPublicKey
    let amount = transaction.amount

    // 检查 senderPublicKey 对应的 UTXO 是否存在
    let fromUTXO = this.utxos[fromPublicKey]
    if (!(fromPublicKey in this.utxos) || fromUTXO.amount < amount) {
      return false
  }
    fromUTXO.amount -= amount;
    if (fromUTXO.amount === 0) {
      delete this.utxos[fromPublicKey];
    }

    // 增加 receiverPublicKey 的UTXO
    let toPublicKey = transaction.toPublicKey;
    this.addUTXO(toPublicKey, amount);
}

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool 
   */

  isValidTransaction(fromPublicKey) {
    let utxo = this.utxos[fromPublicKey];
    if (!utxo || utxo.amount < this.amount) {
      return false;
    }
    return true;
  }
  
}

export default UTXOPool
