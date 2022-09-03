import React from "react";
import "./styles.css";
import Lot from "../Lot";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Model from "../Model";

const Grid = (props) => {
  const [lots, setLots] = useState([]);
  const [gridData, setGridData] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [modelProps, setModelProps] = useState();

 
  useEffect(() => {
    if (gridData) {
      generateGrid();
    }
  }, [JSON.stringify(gridData)]);

  useEffect(() => {
    fetchGridData();
  }, []);

  const fetchGridData = async () => {
    const res = await axios.get("http://localhost:9000/blocks/lots");
    setGridData(res.data);
  };

  const generateGrid = async () => {
    const lotsToShow = [];
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        let foundLot;
        try {
          foundLot = gridData.find(
            (lot) => lot.location.x === i && lot.location.y === j
          );
          if (foundLot.blockType === "NFT") {
            //push nft lots
            lotsToShow.push(
              <Lot
                user={props.user}
                setIsOpen={setIsOpen}
                setModelProps={setModelProps}
                blockType={foundLot.blockType}
                key={foundLot._id}
                id={foundLot._id}
                owner={foundLot.owner}
                price={foundLot.price}
                isForSale={foundLot.isForSale}
                hash={foundLot.hash}
                description={foundLot.description}
              />
            );
          } else {
            //push regular lot
            lotsToShow.push(
              <Lot
                setIsOpen={setIsOpen}
                key={foundLot._id}
                id={foundLot._id}
                blockType={foundLot.blockType}
              />
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    setLots(lotsToShow);
  };

  return (
    <div className="grid">
      {isOpen && (
        <Model
          open={isOpen}
          onClose={() => setIsOpen(false)}
          props={{ ...modelProps, fetchGridData, setModelProps }}
        ></Model>
      )}
      <TransformWrapper defaultScale={2} defaultRoistionX={100}>
        <TransformComponent>{lots}</TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Grid;
