export default class UTXO {//未被花费的交易输出，一个账户的输入-输出
  constructor(amount,fee=0) {
  this.amount=amount
  this.fee=fee
  }
}
