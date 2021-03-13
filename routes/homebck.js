const express = require('express');
const router = express.Router();
const fs = require('fs');//um auf datein zugreifen

router.get('/', (req, res) => {
    res.sendFile(__dirname + "/templates/home.html");
})
module.exports = router;