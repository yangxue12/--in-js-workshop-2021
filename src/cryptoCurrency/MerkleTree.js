import sha256 from 'crypto-js/sha256.js'
import { Buffer } from 'node:buffer';

class MerkleTree {
  constructor(data) {
    this.leaves = data.map(d => sha256(d).toString())//将data中每一个元素都hash，保存到leaves中
    this.root = this.build(this.leaves)
  }
  // 递归构建树
  build(nodes) {
    if (nodes.length == 1) {//没有子节点
      return nodes[0]
    }
    const parents = []
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i]
      const right = i + 1 == nodes.length ? left : nodes[i + 1]
      const parent = sha256(left+right).toString()//左右节点求hash得到根节点的hash
      parents.push(parent)
    }
    return this.build(parents);//图上的倒数第二层经过hash之后的那个
  }

  //生成 Merkle Proof
  generateProof(target) {
    const proof = [];
    for (let i = 0; i < this.leaves.length; i += 2) {
      const left = this.leaves[i];
      const right = i + 1 === this.leaves.length ? left : this.leaves[i + 1];
      if (Buffer.compare(Buffer.from(left), Buffer.from(target)) == 0) {
        proof.push('R' + right.toString('hex'));
        return proof;
      } else if (Buffer.compare(Buffer.from(right), Buffer.from(target)) == 0) {
        proof.push('L' + left.toString('hex'));
        return proof;
      }
      const parent = sha256(left+right).toString()
      if (Buffer.compare(Buffer.from(parent),Buffer.from(target)) == 0) {
        proof.push('L' + left.toString('hex'));
        proof.push('R' + right.toString('hex'));
        return proof;
      }
    }
    return proof;
  }

  //验证 Merkle Proof
  verifyProof(proof, target, root) {
    let current = target;
    for (let i = 0; i < proof.length; i++) {
      const isLeft = proof[i][0] ==    'L'
      const sibling = Buffer.from(proof[i].slice(1), 'hex')
      const parent = sha256((isLeft ? current : sibling)+(isLeft ? sibling : current)).toString()
      current = parent;
    }
    return Buffer.compare(Buffer.from(current), Buffer.from(root)) == 0;
  }
}

// 数据集
const data = ['Transaction 1', 'Transaction 2', 'Transaction 3', 'Transaction 4']

// 构建 Merkle Tree
const tree = new MerkleTree(data)

// 获取 Merkle Proof
const targetData = 'Transaction 5';
const targetHash =Buffer.from(sha256(targetData).toString(),'hex')
const proof = tree.generateProof(targetHash.toString());

// 验证 Merkle Proof
const root = Buffer.from(tree.root,'hex')
console.log(tree.verifyProof(proof, targetHash, root)); // false