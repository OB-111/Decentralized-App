import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.css";
import URL from '../../assets/API_URL'

const Signup = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("guest");
  const [user, setUser] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("current-user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${URL}/users/createUser`, {
      userName: userName,
      password: password,
      userType: userType,
    });
    if (!res.data) {
      alert("Username or password already exists Please try again");
    }
    // set the state of the user
    setUser(res.data);
    // store the user in localStorage
    localStorage.setItem("current-user", JSON.stringify(res.data));
  };
  if (user) {
    window.location = "/";
  }
  return (
    <div className="signIn">
      <form onSubmit={handleSubmit}>
        <h3>Register</h3>

        <div className="form-group">
          <label>User name</label>
          <input
            type="text"
            className="form-control"
            placeholder="User name"
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>password</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>userType</label>
          <select onChange={(event) => setUserType(event.target.value)}>
            <option value="guest">guest</option>
            <option value="seller">seller</option>
          </select>
        </div>

        <button type="submit" className="btn btn-dark btn-lg btn-block">
          Register
        </button>
        <p className="forgot-password text-right"></p>
      </form>
    </div>
  );
};

export default Signup;
