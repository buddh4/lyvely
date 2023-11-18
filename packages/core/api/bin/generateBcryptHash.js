#!/usr/bin/env node

const bcrypt = require('bcrypt');

const plaintextPassword = process.argv[2]; // Get the plaintext password from command line arguments

if (!plaintextPassword) {
  console.error('Usage: node generateBcryptHash.js <password>');
  process.exit(1);
}

const saltRounds = 10; // Number of bcrypt rounds (cost factor)

bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating bcrypt hash:', err);
  } else {
    console.log('Bcrypt Hash:', hash);
  }
});
