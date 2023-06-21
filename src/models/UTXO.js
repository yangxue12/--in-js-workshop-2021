export default class UTXO {
  constructor(amount, fee = 0) {
    this.amount = amount
    this.fee = fee
  }
}