import React from "react";
import { Link } from "react-router-dom";
import "../Style.css";

function Register() {
  return (
    <div className="RegisterPage">
      <div className="RegisterCard">
        <h2 className="PanelTitle">Create an account</h2>
        <p className="PanelSub">Join us and get started!</p>

        <form className="RegisterForm" onSubmit={(e) => e.preventDefault()}>
          <label className="Field">
            <span className="FieldLabel">Full Name</span>
            <input className="TextInput" type="text" placeholder="Enter your name" />
          </label>

          <label className="Field">
            <span className="FieldLabel">Email</span>
            <input className="TextInput" type="email" placeholder="Enter your email" />
          </label>

          <label className="Field">
            <span className="FieldLabel">Password</span>
            <input className="TextInput" type="password" placeholder="Create a password" />
          </label>
          <div className="FormRow">
            <a>Must be at least 8 characters</a>
            </div>

          <button className="Primary" type="submit">
            Sign Up
          </button>
        </form>

        <p className="BottomText">
          Already have an account?{" "}
          <Link className="HighlightLink" to="/Login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
