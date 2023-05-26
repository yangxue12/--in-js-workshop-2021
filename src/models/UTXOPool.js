import UTXO from './UTXO.js'

class UTXOPool {
  constructor(utxos = {}) {//utxos 相当于账户
    this.utxos=utxos
  }

  // 添加交易函数
  /**
   * 将交易的信息更新至 UTXOPool 中
   */
  addUTXO(publicKey,amount) {//公钥代表账户
        if(this.utxos[publicKey]){//如果该账户已存在则交易叠加
            this.utxos[publicKey].amount+=amount
        }else{
            const u=new UTXO(amount)
            this.utxos[publicKey]=u
        }
  }

  // 将当前 UXTO 的副本克隆
  clone() {
  return new UTXOPool(this.utxos)
  }
}

export default UTXOPool
