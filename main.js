const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

}

class Blockchain {

    constructor() {
        this.chain = [this.createFirstBlock()];
    }

    createFirstBlock() {
        return new Block(0,'25/05/2020','First Block','0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length ;i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }

        return true;

    }
}

let wallet = new Blockchain();
wallet.addBlock(new Block(1,"24/05/2020",{amount: 4}));
wallet.addBlock(new Block(2,"25/07/2020",{amount: 10}));

console.log('Is valid blockchain ?' + wallet.isChainValid());

wallet.chain[1].data = {amount: 100};
wallet.chain[1].hash = wallet.chain[1].calculateHash();

console.log('Is valid blockchain ?' + wallet.isChainValid());

// console.log(JSON.stringify(wallet,null,4));