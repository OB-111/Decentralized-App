const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 9000;
const url =
  "mongodb+srv://omri:omri@cluster0.s06wv.mongodb.net/DB?retryWrites=true&w=majority";
const utils = require("./utils");
const keys = require("./controllers/userController");

const userAdmin = {
  id: 1,
  userName: "O&T.Ltd",
  password: "123",
  userType: "seller",
  amount: 1000,
  keys: keys.creatKeys(),
};
mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
app.use(express.json());
try {
  db.on("open", async () => {
    console.log("connected");
    const dataExist = await db.collection("blocks").countDocuments();
    const userAdminExicst = await db.collection("users").countDocuments();

    if (dataExist == 0) {
      db.collection("blocks").insertMany(
        utils.createBoardData(GRID_SIZE),
        (error, result) => {
          if (result) {
            console.log("nfts inserted to DB..");
          } else if (error) {
            console.error(error);
          }
        }
      );
    }
    if (userAdminExicst == 0) {
      db.collection("users").insertOne(userAdmin);
    }
  });
} catch (error) {
  console.log("Error: " + error);
}

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);
const userRouter = require("./routes/userRoutes");
app.use("/users", userRouter);
const blockRouter = require("./routes/lotRoutes");
const { GRID_SIZE } = require("./consts");
app.use("/blocks", blockRouter);
app.listen(port, () => {
  console.log("Server started");
});
