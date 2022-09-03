const express = require("express");
const Lots = require("../controllers/lotController");
const router = express.Router();

router.get("/lots", Lots.getAllLots);
router.put("/updateLot/:id", Lots.updateLot);
router.get("/getLot/:id", Lots.getLot);

module.exports = router;
