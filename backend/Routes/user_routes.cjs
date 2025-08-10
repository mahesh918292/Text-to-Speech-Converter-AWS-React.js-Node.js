const express = require("express");
const { synthesizeSpeech } = require("../Controller/user-controller.cjs");

const router = express.Router();

router.post("/speak", synthesizeSpeech);

module.exports = router;