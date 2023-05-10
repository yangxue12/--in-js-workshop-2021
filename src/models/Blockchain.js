

// Blockchain
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
    this.blocks=new Map()
  }

  // 2. 定义 longestChain 函数
  /* 
    返回当前链中最长的区块信息列表
  */
    longestChain () {
      let longestChain = [];
      for (const [hash, block] of this.blocks) { //解构赋值
        const chain = [block];
        let previousBlock = block;
        while (this.blocks.has(previousBlock.previousHash) && (this.blocks.has(previousBlock.previousHash)).has !== 'root') {
          previousBlock = this.blocks.get(previousBlock.previousHash);
          chain.unshift(previousBlock);
        }
        if (chain.length > longestChain.length) {
          longestChain = chain;
        }
      }
      return longestChain;
    }
  }

export default Blockchain
