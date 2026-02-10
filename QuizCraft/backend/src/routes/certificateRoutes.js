const express = require("express");
const router = express.Router();
const { generateCertificate } = require("../controllers/certificateController");

router.get("/certificate/:username/:courseName", generateCertificate);

module.exports = router;
