const express = require('express');
const router = express.Router();

//user ist angemeldet wenn user dann blende sachen aus regie bleibt alles wie es ist
import { res } from './main.js';
let loginUser = require('../../../routes/loginbck');
console.log(loginUser, 'loginuser')

console.log(res, 'who are oyu?')

module.exports =
    router;