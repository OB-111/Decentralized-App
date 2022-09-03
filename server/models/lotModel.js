const mongoose = require("mongoose");
const blockSchema = mongoose.Schema({
  blockType: {
    type: String,
    enum: ["NFT", "PARK", "ROAD"],
    required: true,
  },
  isForSale: {
    type: Boolean,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  owner: {
    type: Object,
    required: false,
  },
  location: {
    type: { x: Number, y: Number },
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  hash: {
    type: String,
    required: false,
  },
});

var blockData = mongoose.model("blocks", blockSchema);
module.exports = blockData;
