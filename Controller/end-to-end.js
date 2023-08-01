const crypto = require('crypto');

const alice = crypto.getDiffieHellman('modp15');
const bob = crypto.getDiffieHellman('modp15');

alice.generateKeys();
bob.generateKeys();

const alicesecret = alice.computeSecret(bob.getPublicKey(),null,'hex')
const bobsecret = bob.computeSecret(alice.getPublicKey(),null,'hex')

console.log(alicesecret === bobsecret)
