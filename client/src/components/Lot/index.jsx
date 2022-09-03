import React from "react";
import classNames from "classnames";
import "./styles.css";

const Lot = (props) => {
  const handleClick = () => {
    if (props.user === null) {
      return alert("must LogInor SignUp Before!");
    }
    if (props.blockType === "NFT") {
      props.setModelProps(props);
      props.setIsOpen(true);
    } else {
      return;
    }
  };
  
  return (
    <>
      <div
        className={classNames("lot", {
          mylot: props.user
            ? props.owner.userName === props.user.userName
            : false,
        })}
        onClick={() => handleClick()}
        style={{
          backgroundColor:
            props.blockType === "NFT"
              ? "red"
              : props.blockType === "ROAD"
              ? "gray"
              : "green",
        }}
      ></div>
    </>
  );
};

export default Lot;
