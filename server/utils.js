const SHA256 = require("crypto-js/sha256");
const keys = require("./controllers/userController");
const userAdmin = {
  id: 1,
  userName: "O&T.Ltd",
  password: "123",
  userType: "seller",
  amount: 1000,
  keys: keys.creatKeys(),
};
const CONSTS = require("./consts");

const randomPrice = () => {
  return Math.floor(Math.random() * (200 - 15)) + 15;
};

const calcualteHash = (x, y) => {
  return SHA256(x, y).toString();
};

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.createBoardData = function (gridSize) {
  const lots = [];
  let pointsCreated = 0;
  let numberOfNfts = 0;
  let x, y;
  while (pointsCreated < gridSize) {
    x = randomIntFromInterval(0, CONSTS.ROW_LENGTH - 1);
    y = randomIntFromInterval(0, CONSTS.ROW_LENGTH - 1);
    while (lots.find((lot) => lot.location.x === x && lot.location.y === y)) {
      x = randomIntFromInterval(0, CONSTS.ROW_LENGTH - 1);
      y = randomIntFromInterval(0, CONSTS.ROW_LENGTH - 1);
    }
    pointsCreated++;
    let lotTypeNumber;
    if (numberOfNfts > CONSTS.NUMBER_OF_NFTS) {
      lotTypeNumber = randomIntFromInterval(2, 3);
    } else {
      lotTypeNumber = randomIntFromInterval(1, 3);
    }
    if (CONSTS.lotTypes[lotTypeNumber] === CONSTS.NFT) {
      lots.push({
        blockType: CONSTS.NFT,
        isForSale: true,
        price: randomPrice(),
        owner: userAdmin,
        location: { x, y },
        description: "https://ob-111.github.io/MemoGame/",
        hash: calcualteHash(String(x), String(y)),
      });

      numberOfNfts++;
    } else if (CONSTS.lotTypes[lotTypeNumber] === CONSTS.PARK) {
      lots.push({ blockType: CONSTS.PARK, location: { x, y } });
    } else {
      lots.push({ blockType: CONSTS.ROAD, location: { x, y } });
    }
  }
  return lots;
};
