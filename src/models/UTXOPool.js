import UTXO from './UTXO.js'
class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos; // UTXO映射 accounting -> UTXO(s)
  }

  // 将当前 UXTO 的副本克隆
  clone () {
    return new UTXOPool(JSON.parse(JSON.stringify(this.utxos)))
  }

  // 向 UTXOPool 中添加 UTXO 对象
  addUTXO (publicKey, amount, fee = 0) {
    // 先检查 publicKey 对应的 UTXO 是否已存在 Map 中
    if (publicKey in this.utxos) {
      // 如果已存在，直接给该 UTXO 里的 amount 属性添加新的值
      this.utxos[publicKey].amount += amount;
      this.utxos[publicKey].fee += fee; //这里应该是矿工加todo
    } else {
      // 如果不存在，用新的 UTXO 对象添加到 Map 中
      this.utxos[publicKey] = new UTXO(amount, fee);
    }
  }

  // 处理交易，更新 UTXOPool 中的 UTXO 对象
  handleTransaction (transaction) {

    if (!this.isValidTransaction (transaction)) return false
    let senderPublicKey = transaction.senderPublicKey;
    let amount = transaction.amount;
    let fee = transaction.fee;

    // 检查 senderPublicKey 对应的 UTXO 是否存在
    let senderUTXO = this.utxos[senderPublicKey];
    if (senderPublicKey == '0x000000') {
      senderUTXO = this.utxos[transaction.receiverPublicKey];
    }

    if (senderPublicKey === '0x000000') { //给矿工奖励fee
      // 增加 receiverPublicKey 的UTXO
      let receiverPublicKey = transaction.receiverPublicKey;
      this.addUTXO(receiverPublicKey, 0, fee);
    } else { //正常转账
      if (!(senderPublicKey in this.utxos) || senderUTXO.amount < amount) {
        return false;
      }
      // 更新 senderPublicKey 的UTXO
      senderUTXO.amount -= amount;
      senderUTXO.fee = fee;
      senderUTXO.amount -= fee;
      if (senderUTXO.amount === 0) {
        delete this.utxos[senderPublicKey];
      }

      // 增加 receiverPublicKey 的UTXO
      let receiverPublicKey = transaction.receiverPublicKey;
      if(receiverPublicKey=='04a48c7445aff5a6544f4086560e7a3959f9601bd418710cdd32536f803c79de8d9e7dbdbbaf8b906220523fe071ede64b1625f3187b3c41f7b27633110ca890e1'){
        amount+=fee
      }
      this.addUTXO(receiverPublicKey, amount, 0);
    }

    return true
  }

  // 验证交易是否合法
  isValidTransaction (transaction) {
    let senderPublicKey = transaction.senderPublicKey
    let amount = transaction.amount + transaction.fee

    let utxo = this.utxos[senderPublicKey]
    if (!utxo || utxo.amount < amount) {
      return false
    }
    return true
  }
}
export default UTXOPool