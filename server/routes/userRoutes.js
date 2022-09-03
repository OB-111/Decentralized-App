const express = require("express");
const user = require("../controllers/userController");
const router = express.Router();

router.get("/getAllUsers", user.getAllUsers);
router.get("/getspecUser/:userName", user.getspecUser);
router.put("/updateUser/:userName", user.updateUser);
router.post("/createUser", user.createUser);
router.post("/signature", user.signData);
router.post("/verify", user.verify);
router.post("/loginUser/:userName", user.loginUser);
router.delete("/:userKey", user.deletUser);
module.exports = router;
