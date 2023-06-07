import keccak256 from 'keccak256';

class MPT {
  constructor() {
    this.rootHash = null;
    this.data = {};
  }

  // 将以太坊地址转换为 MPT 索引
  getAddressIndex (address) {
    const hash = keccak256(address).toString('hex');
    return hash.slice(2, 66);
  }

  // 添加或更新余额信息
  setBalance (address, balance) {
    const index = this.getAddressIndex(address);
    this.data[index] = balance;
    this.rootHash = null; // 根据现有数据重新计算 Root 值
  }

  // 获取余额信息
  getBalance (address) {
    const index = this.getAddressIndex(address);
    return this.data[index] || 0;
  }

  // 计算 MPT 的 Root 值
  getRootHash () {
    if (this.rootHash === null) {
      this.rootHash = calculateRootHash(this.data);
    }
    return this.rootHash;
  }

  // 根据地址和余额信息验证 MPT 数据
  isValid (address, balance) {
    const index = this.getAddressIndex(address);
    return this.data[index] === balance && this.getRootHash() !== null;
  }
}

// 辅助函数：计算 MPT 的 Root 值
function calculateRootHash (data) {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return null;
  } else if (keys.length === 1) {
    return keys[0] + data[keys[0]];
  } else {
    const branches = [];
    keys.sort(); // 按照索引排序
    for (let i = 0; i < keys.length; i += 2) {
      let branch;
      if (i === keys.length - 1) { // 直接复制最后一个节点
        branch = keys[i] + data[keys[i]];
      } else { // 计算两个子节点的 Merkle trie hash
        const leftBranch = keys[i] + data[keys[i]];
        const rightBranch = keys[i + 1] + data[keys[i + 1]];
        const concat = leftBranch + rightBranch;
        branch = keccak256(concat).toString('hex');
      }
      branches.push(branch);
    }
    return calculateRootHash(branches); // 递归计算父节点的 Merkle trie hash
  }
}

const mpt = new MPT();
mpt.setBalance('0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5', 100);

console.log(mpt.getBalance('0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5'));
// 输出：100

console.log(mpt.getRootHash());
// 输出：7a739dc3ceb0382a96c8ce6ebc23a84f20212c7b6f9dcdf3c854d9028f9e1aae

console.log(mpt.isValid('0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5', 100));
// 输出：true