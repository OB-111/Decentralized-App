import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "react-edit-text/dist/index.css";
import styles from './styles.css'
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  background: "#FFF",
  padding: "50px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

const Model = ({ props, open, onClose }) => {
  const [signature, setSignature] = useState("");
  const [verify, setVerify] = useState("");
  const [price, setPrice] = useState(props.price);
  const [description, setDescription] = useState(props.description);
  const [isForSale, setisForSale] = useState();
  const [displayedAmount, setDisplayedAmount] = useState();
  const [user, setUser] = useState();
  const [isGuest, setIsGuest] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const localStorageUser = JSON.parse(localStorage.getItem("current-user"));

  //keep currenu user LoggedIn
  useEffect(() => {
    if (localStorageUser) {
      async function fetch() {
        const res = await axios.get(
          `http://localhost:9000/users/getspecUser/${localStorageUser.userName}`
        );
        setUser(res.data);
      }
      fetch();
    }
  }, []);


  useEffect(() => {
    if (user) {
      setDisplayedAmount(user.amount);
      setEditMode(user.userName === props.owner.userName); //allow guest play only in game
      setIsGuest(user.userType === 'guest')
    }
  }, [user]);

  if (!open) return null;

  //Lot owner sign with private key on hash (hash that based on Lot proprties), then the buyer verify is signature with his public key
  const creatSignature = async () => {
    if (!props.isForSale) {
      return alert("NOT FOR SALE!");
    }
    if(!user){
      alert('must signUp or LogIn Before!')
    }
    else{
      const toSign = await axios.post("http://localhost:9000/users/signature", {
        data: props.hash,
        privateKey: props.owner.keys.privateKey,
      });
      if (!toSign) {
        setSignature("IS NOT VALID");
      }
      setSignature(toSign.data);

    }
  
  };
  
  //verify data with owner publickey and his lot hash
  const verifySignature = async () => {
    const privateKey = props.owner.keys.privateKey;
    const publicKey = props.owner.keys.publicKey;
    const verify = await axios.post("http://localhost:9000/users/verify", {
      data: props.hash,
      publicKey: publicKey,
      signature: signature,
    });
    if (!verify) {
      setVerify("Identification Failed");
    }
    setVerify("Identification Succeeded!!");
  };

  const updateBuyerAmount = async () => {
    const updatedBuyer = await axios.put(
      `http://localhost:9000/users/updateUser/${String(user.userName)}`,
      { userName: String(user.userName), amount: user.amount - props.price }
    );
    setUser(updatedBuyer.data.user);
    setDisplayedAmount(updatedBuyer.data.user.amount);
    await axios.put(
      `http://localhost:9000/users/updateUser/${props.owner.userName}`,
      {
        userName: String(props.owner.userName),
        amount: props.owner.amount + props.price,
      }
    );
  };

  const buyLot = async () => {
    if (user.amount < props.price) {
      setEditMode(false);
      alert("There is not enough Money in Your Wallet for purches this Lot!");
    }else{
      const res = await axios.put(
        `http://localhost:9000/blocks/updateLot/${props.id}`,
        { id: props.id, price: props.price, owner: user }
      );
      if (res) {
        alert('Congratulations, you now own the plot!');
        
      } 
      //update owner
      await updateBuyerAmount();
      props.setModelProps({ ...props, owner: res.data.lot.owner });
      await props.fetchGridData();
      setEditMode(res.data);
    }
    
  };

  const lotUpdate = async () => {
    //after owner bought the Lot
    const res = await axios.put(
      `http://localhost:9000/blocks/updateLot/${props.id}`,
      { id: props.id, ...isForSale && { isForSale}, price: price, description: description }
    );
    await props.fetchGridData();
    setEditMode(res.data);
    props.setModelProps({
      ...props,
      price: res.data.lot.price,
      description: res.data.lot.description,
      isForSale: res.data.lot.isForSale,
    });
    setPrice(res.data.lot.price);
  };


  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        {props.blockType === "NFT" ? (
          <div className="lotDetails">
            <br />
            <div>Your Wallet amount: {displayedAmount}$</div>
            <h2>Lot Details:</h2>
            <label >Block Type: </label>
            {props.blockType}
            <br />
            <label>Owner: </label>
            {String(props.owner.userName)}
            <br />
            <label>Price: </label>
            {props.price}$<br />
            <label>isForSale: </label>
            {String(props.isForSale).toUpperCase()}
            <br />
            <>      
            <button className="btn btn-dark btn-lg btn-block" onClick={()=>window.location.href=`${description}`}>
              play game!
            </button>
            <label>current Link: {props.description}</label>
            </>
            <br></br>
            <br></br>
            <button
              disabled={isGuest}
              className="btn btn-dark btn-lg btn-block"
              onClick={() => creatSignature()}
            >
              SignBlock
            </button>     
            <label>{signature.slice(1, 15)}</label>
            <br />
            {signature ? (
              <>
                <button
                  className="btn btn-dark btn-lg btn-block"
                  onClick={() => verifySignature()}
                >
                  Verify Signature
                </button>
                <label>{verify}</label>
                <br />
              </>
            ) : (
              <></>
            )}
            {verify ? (
              <>
                <button
                  className="btn btn-dark btn-lg btn-block"
                  onClick={buyLot}
                >
                  Buy
                </button>
              </>
            ) : (
              <></>
            )}
            {editMode ? (
              <>
                <div className="form-group">
                  <label>Lot Price</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="price"
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Is For Sale</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="true/false"
                    onChange={(event) => setisForSale(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Link to Game</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://example.com"
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <button
                  className="btn btn-dark btn-lg btn-block"
                  onClick={lotUpdate}
                >
                  Edit Lot
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          //if Lot!=NFT
          <>BlockType:{props.blockType}</>
        )}
        <br />
        <button className="btn btn-dark btn-lg btn-block" onClick={onClose}>
          Close
        </button>
      </div>
    </>,

    document.getElementById("portal")
  );
};

export default Model;
