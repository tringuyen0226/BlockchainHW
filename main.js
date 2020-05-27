const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

class Block {
    // constructor(index, timestamp, data, previousHash = '') {
    //     this.index = index;
    //     this.timestamp = timestamp;
    //     this.data = data;
    //     this.previousHash = previousHash;
    //     this.hash = this.calculateHash();
    //     this.nonce = 0;
    // }

    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }


    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0,difficulty)!== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: ' + this.hash )   ;
    }

}

class Blockchain {

    constructor() {
        this.chain = [this.createFirstBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createFirstBlock() {
        return new Block(0,'24/05/2020','First Block','0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction( null, miningRewardAddress, this.miningReward )
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain)
        {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }
                else if(trans.toAddress === address)
                {
                    balance += trans.amount;
                }

            }
        }

        return balance;
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
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


//Test create block chain

// wallet.addBlock(new Block(1,"24/05/2020",{amount: 4}));
// wallet.addBlock(new Block(2,"25/07/2020",{amount: 10}));

// console.log(JSON.stringify(wallet,null,4));

//Test valid chain
// console.log('Is valid blockchain ?' + wallet.isChainValid());

// wallet.chain[1].data = {amount: 100};
// wallet.chain[1].hash = wallet.chain[1].calculateHash();

// console.log('Is valid blockchain ?' + wallet.isChainValid());

//Test implement of Proof of Work
// console.log('Mining block 1...');
// wallet.addBlock(new Block(1,"24/05/2020",{amount: 1}));

// console.log('Mining block 2...');
// wallet.addBlock(new Block(2,"25/07/2020",{amount: 2}));

//Test transaction 
wallet.createTransaction(new Transaction('address1','address2',200));
wallet.createTransaction(new Transaction('address2','address1',80));

console.log('\n Starting the miner....');
wallet.minePendingTransactions('tri-address');

console.log('\n Balance of Tri is ', wallet.getBalanceOfAddress('tri-address'));

console.log('\n Starting the miner again....');
wallet.minePendingTransactions('tri-address');

console.log('\n Balance of Tri is ', wallet.getBalanceOfAddress('tri-address'));
