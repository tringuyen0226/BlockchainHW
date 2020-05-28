const {Blockchain, Block ,Transaction} =  require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('5e32b547f9c2c7dc2491d77650bf915f84896b63c39ce73f74a5106ccb31bed2');
const myWalletAddress = myKey.getPublic('hex');

let wallet = new Blockchain();


//Test create block chain

// wallet.addBlock(new Block(1,"24/05/2020",{amount: 4}));
// wallet.addBlock(new Block(2,"25/07/2020",{amount: 10}));

// console.log(JSON.stringify(wallet,null,4));

//Test valid chain
// wallet.addBlock(new Block(1,"24/05/2020",{amount: 4}));
// wallet.addBlock(new Block(2,"25/07/2020",{amount: 10}));
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
// wallet.createTransaction(new Transaction('address1','address2',200));
// wallet.createTransaction(new Transaction('address2','address1',80));

// console.log('\n Starting the miner....');
// wallet.minePendingTransactions('tri-address');

// console.log('\n Balance of Tri is ', wallet.getBalanceOfAddress('tri-address'));

// console.log('\n Starting the miner again....');
// wallet.minePendingTransactions('tri-address');

// console.log('\n Balance of Tri is ', wallet.getBalanceOfAddress('tri-address'));

//Test sign transaction
// const tx1 = new Transaction(myWalletAddress, 'public key goes here',10);
// tx1.signTransaction(myKey);
// wallet.addTransaction(tx1);

// console.log('\n Starting the miner....');
// wallet.minePendingTransactions(myWalletAddress);

// console.log('\n Balance of Tri is ', wallet.getBalanceOfAddress(myWalletAddress));
// console.log('Is valid chain',  wallet.isChainValid());  



