
import UTXOPool from './UTXOPool.js'
import Block from './Block.js'
import { reverse } from 'ramda'


class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
      - 名字
      - 创世区块
      - 存储区块的映射
  */
  constructor(name) {
    this.name=name
    this.genesis=null
    this.blocks={}
 }
    
  // 2. 定义 longestChain 函数
  /* 
  返回当前链中最长的区块信息列表
  */
  longestChain () {
    let longestChain = [];
    let keys = Object.keys(this.blocks)
    let max=0
    let key_value=0
    for (const key of keys) { 
      if (max<this.blocks[key].height){
        max=this.blocks[key].height
        key_value=key
      }
    }
    while (key_value!=this.genesis.hash) {
      longestChain.unshift(this.blocks[key_value])
      key_value=this.blocks[key_value].previousHash
     
    }
       //let previousBlock = block;
      /*while (this.containsBlock(previousBlock) ) {
        previousBlock = this.blocks[previousBlock.previousHash];
        chain.unshift(previousBlock);
      }*/
      // if (chain.length > longestChain.length) {   
      //   longestChain = chain;
      // }
      return longestChain; 
    }
    
  // 判断当前区块链是否包含
  containsBlock(block) {
    // 添加判断方法
    /*let temp=this.maxHeightBlock()
    for(let i=0;i<this.longestChain().length;i++){
      if(temp.hash==this.blocks.hash){
        return true
      }
      temp.hash=temp.previousHash 
    }*/
    
    let blockss=block.blockchain.blocks
    let keys = Object.keys(blockss)
    for (let key of keys){
      
      if (key==block.hash){
        return true
      }
    }
    return false
  }

  // 获得区块高度最高的区块
  maxHeightBlock() {
   return this.longestChain()[this.longestChain().length-1]

  }

  // 添加区块
  /*

  */
  _addBlock(block) {
    if (!block.isValid()) return //区块不合法
    if (this.containsBlock(block)) return //区块已经添加过
    this.blocks[block.hash] = block
    //block.previousHash=this.longestChain()[this.longestChain().length-1].hash
    //block.hash=block.calculateHash()
    // 添加 UTXO 快照与更新的相关逻辑
  //   if(block.timeStamp=="root"){//挖矿交易奖励12.5bit，其他是父区块的克隆
  //     block.utxoPool.addUTXO(block.hash,12.5)
  // }else{
  //     block.utxoPool=block.blockchain.blocks[block.previousHash].utxoPool.clone()
  //     return
  // }
  // if(block.coinbaseBeneficiary!=undefined){//本区块还有交易需要继续添加
  //     block.utxoPool.addUTXO(block.coinbaseBeneficiary,12.5)
  // }else{
  // block.utxoPool.addUTXO(block.blockchain.blocks[block.previousHash].coinbaseBeneficiary,12.5)
  // }
  if(block.previousHash==this.genesis.hash){  //如果区块是root，添加交易
    block.utxoPool.addUTXO(block.coinbaseBeneficiary, 12.5)
  }
  if (block.previousHash==this.genesis.hash){ //如果是其他区块，交易是父区快的克隆
    block.utxoPool = this.genesis.utxoPool.clone()
    block.utxoPool.addUTXO(block.coinbaseBeneficiary, 12.5)
  }else{
    block.utxoPool = block.blockchain.blocks[block.previousHash].utxoPool.clone()
    if(block.coinbaseBeneficiary != undefined){       //本区块还有交易，再加
        block.utxoPool.addUTXO(block.coinbaseBeneficiary, 12.5)
       }else{
        block.utxoPool.addUTXO(block.blockchain.blocks[block.previousHash].coinbaseBeneficiary, 12.5)
       }
  }
  
  }

}

export default Blockchain
