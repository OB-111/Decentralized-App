const express = require("express");
const router = express.Router();
const Lot = require("../models/lotModel");

const getAllLots = async (req, res) => {
  try {
    const NFTS = await Lot.find();

    res.status(200).json(NFTS);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getLot = async (req, res) => {
  let id_ = req.body.id;
  try {
    const lot = await Lot.findOne({ _id: id_ });
    res.status(200).json(lot);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateLot = async (req, res) => {
  let _id = req.body.id;
  try {
    const lot = await Lot.findByIdAndUpdate(
      {
        _id,
      },
      {
        isForSale: req.body.isForSale,
        price: req.body.price,
        owner: req.body.owner,
        description: req.body.description,
      },
      { new: true }
    );

    res.status(202).json({ lot: lot });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.getAllLots = getAllLots;
module.exports.getLot = getLot;
module.exports.updateLot = updateLot;
