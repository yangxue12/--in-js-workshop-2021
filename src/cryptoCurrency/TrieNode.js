class TrieNode {
  constructor() {
    this.children = new Map(); // 使用 Map 来存储子节点
    this.hasWord = false; // 使用 hasWord 属性来表示该节点是否存储了某个单词
  }

  insert(word) {
    let node = this;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.hasWord = true;
  }

  delete(word, index = 0) {
    if (index === word.length) {
      if (this.hasWord) {
        this.hasWord = false;
        return this.children.size === 0;
      }
    } else {
      const char = word[index];
      if (this.children.has(char)) {
        const childNode = this.children.get(char);
        const shouldDelete = childNode.delete(word, index + 1);
        if (shouldDelete) {
          this.children.delete(char);
          return this.children.size === 0;
        }
      }
    }
    return false;
  }

  search(word, index = 0) {
    let node = this;
    for (let i = index; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return node.hasWord;
  }
}

const trie = new TrieNode();
trie.insert('apple');
trie.insert('banana');
trie.insert('orange');
trie.insert('aborb')
console.log(trie);
trie.delete('banana');
console.log(trie.children);
console.log(trie.search('aborb'));
console.log(trie.search('banana'));
console.log(trie.search('apple'));