import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import Grid from "./components/Grid";
import Login from "./components/LogIn/";
import Signup from "./components/Signup";

import axios from "axios";
import URL from "./assets/API_URL";

function App() {
  const [user, setUser] = useState();
  const [localStorageUser, setLocalStorageUser] = useState(
    JSON.parse(localStorage.getItem("current-user"))
  );

  useEffect(() => {
    if (localStorageUser) {
      axios
        .get(`${URL}/users/getspecUser/${localStorageUser.userName}`)
        .then((res) => {
          setUser(res.data);
        });
    } else {
      setUser(undefined);
    }
  }, [localStorageUser]);

  // logout the user
  const handleLogout = () => {
    localStorage.clear();
    setLocalStorageUser(undefined);
  };
  return (
    <BrowserRouter>
      <div>
        <div className="header">
          <h1>MetaCentrland</h1>
          <NavLink exact activeClassName="active" to="/">
            {user && (
              <>
                <div className="user">
                  USER : {user.userName} is logged In <br></br>
                  <button className="btn btn-dark red  " onClick={handleLogout}>
                    LogOut
                  </button>
                </div>

                <div className="lots-Menu">
                  <span className="nft" styles={{ backgroundColor: "red" }}>
                    NFT{" "}
                  </span>
                  <span
                    className="ownerNfts"
                    styles={{ backgroundColor: "orange" }}
                  >
                    YOURS_NFTS{" "}
                  </span>
                  <span className="park" styles={{ backgroundColor: "green" }}>
                    PARK{" "}
                  </span>
                  <span className="road" styles={{ backgroundColor: "gray" }}>
                    ROAD{" "}
                  </span>
                </div>
              </>
            )}
          </NavLink>
          <NavLink activeClassName="active" to="/login">
            Login
          </NavLink>
          <NavLink activeClassName="active" to="/signup">
            SignUp
          </NavLink>
          <small>(encrypted regetration)</small>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/" component={() => Grid({ user, setUser })} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
