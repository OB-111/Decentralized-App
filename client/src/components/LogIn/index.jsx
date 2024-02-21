import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.css";
import URL from '../../assets/API_URL'

function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState(0);
  const [user, setUser] = useState();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("current-user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_Exicst = { userName, password };
    // send the username and password to the server
    try {
      const res = await axios.post(
        `${URL}/users/loginUser/${userName}`,
        user_Exicst
      );
      // set the state of the user
      setUser(res.data);
      // store the user in localStorage
      localStorage.setItem("current-user", JSON.stringify(res.data));
    } catch (e) {
      alert("Wrong Password , Please Try Again!");
      localStorage.clear();
    }
  };
  if (user) {
    window.location = "/";
  }
  return (
    <div className="logIn">
      <form onSubmit={handleSubmit}>
        <h3>Log in</h3>
        <div className="form-group">
          <label>User name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter User name"
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-dark btn-lg btn-block">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
