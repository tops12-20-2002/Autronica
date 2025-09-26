import React, { useState } from "react";
import { Link } from "react-router-dom";   // ✅ Import Link
import "../App.css"; // keep using your existing styles

function Login() {
  const [loginOpen, setLoginOpen] = useState(false);
  const logoSrc = process.env.PUBLIC_URL + "/AutronicasLogo.png";

  const handleLogin = () => {
    setLoginOpen(true);
  };

  return (
    <div className={`Stage${loginOpen ? " login-open" : ""}`}>
      <div className="Landing">
        <img src={logoSrc} className="Landing-logo" alt="Autronicas logo" />
        {!loginOpen && (
          <button className="LoginButton" type="button" onClick={handleLogin}>
            Log in
          </button>
        )}
      </div>

      <div className="RightPanel" aria-hidden={!loginOpen}>
        <div className="LoginCard">
          <h2 className="PanelTitle">Log in to your account</h2>
          <p className="PanelSub">Welcome back! Please enter your details.</p>

          <form className="LoginForm" onSubmit={(e) => e.preventDefault()}>
            <label className="Field">
              <span className="FieldLabel">Email</span>
              <input
                className="TextInput"
                type="email"
                placeholder="Enter your email"
              />
            </label>

            <label className="Field">
              <span className="FieldLabel">Password</span>
              <input
                className="TextInput"
                type="password"
                placeholder="Enter your password"
              />
            </label>

            <div className="FormRow">
              <label className="CheckRow">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a className="HighlightLink" href="#">
                Forgot Password
              </a>
            </div>

            <button className="Primary" type="submit">
              Sign In
            </button>

            <button className="GoogleBtn" type="button">
              <span className="GIcon">G</span>
              <span>Sign In with Google</span>
            </button>
          </form>

          {/* ✅ Use Link instead of <a> for SPA navigation */}
          <p className="BottomText">
            Don’t have an account?{" "}
            <Link className="HighlightLink" to="/Register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
