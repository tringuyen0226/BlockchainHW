const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(singingKey) {
        if(singingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('Cannot sign transactions for other wallet');
        }

        const hashTx = this.calculateHash();
        const sig = singingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) {
            throw new Error('No signature exists in this transaction');

        }

        const pubKey = ec.keyFromPublic(this.fromAddress,'hex');
        return pubKey.verify(this.calculateHash(), this.signature);

    }
}

class Block {
    constructor(index, timestamp, data, previousHash, transactions = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
        this.transactions = transactions;

    }

    // constructor(timestamp, transactions, previousHash = '') {
    //     this.timestamp = timestamp;
    //     this.previousHash = previousHash;
    //     this.transactions = transactions;
    //     this.hash = this.calculateHash();
    //     this.nonce = 0;
    // }


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

    hasValidTransactions() {
        for(const tx of this.transactions) {
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
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
        const rewardTx = new Transaction(null,miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        // this.pendingTransactions = [
        //     new Transaction( null, miningRewardAddress, this.miningReward )
        // ];
        this.pendingTransactions = [];
    }

    // createTransaction(transaction) {
    //     this.pendingTransactions.push(transaction);
    // }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress)
        {
            throw new Error('Transaction must include from and to add');
        }

        if(!transaction.isValid())
        {
            throw new Error('Cannot add invalid transaction');
        }        

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

            if(!currentBlock.hasValidTransactions())
            {
                return false;
            }

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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
module.exports.Block = Block;
