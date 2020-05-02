import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import cognitoUtils from "./lib/cognitoUtils";
import sessionUtils from "./lib/session";
import analytics from "./lib/analytics";

import Dropdown from "react-bootstrap/Dropdown";

import LoginForm from "./components/LoginForm";
import Documents from "./components/Documents";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FileUpload from "./components/FileUpload";
import InviteForm from "./components/InviteForm";
import AboutPage from "./components/AboutPage";
import CovidNumbers from "./components/CovidNumbers";
import NumbersPage from "./components/NumbersPage";
import LoginPage from "./components/LoginPage";
import ChangePassword from "./components/ChangePassword";
import { Feedback } from "./components/Feedback";

function App() {
  const [show, setShow] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseInvite = () => setShowInvite(false);
  const handleClosePassword = () => setShowPassword(false);
  const handleShow = () => setShow(true);
  const handleShowInvite = () => setShowInvite(true);
  const handleShowPassword = () => setShowPassword(true);

  const redirectToLogin = () => {
    analytics.recordEvent("redirect_to_login");

    window.location.href = cognitoUtils.getCognitoSignInUri();
  };

  const redirectToSignup = () => {
    analytics.recordEvent("redirect_to_signup");

    window.location.href = cognitoUtils.getCognitoSignUpUri();
  };

  const logout = () => {
    analytics.recordEvent("logout");

    sessionUtils.removeSession();
    cognitoUtils.signOutCognitoSession();
  };

  let search = "";
  let profile = "";
  if (sessionUtils.isLoggedIn()) {
    search = (
      <form className="form-inline">
        <input
          className="form-control mr-sm-2 hide"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button
          className="btn btn-outline-primary my-2 my-sm-0 hide"
          type="submit"
        >
          Search
        </button>
        <button
          className="btn btn-success ml-2"
          onClick={handleShow}
          value="Upload"
          type="button"
        >
          Upload
        </button>
        <Feedback />
      </form>
    );
    profile = (
      <Dropdown className="ml-4">
        <Dropdown.Toggle id="dropdown-basic">
          <i className="fas fa-user-md mr-2"></i>
          User Profile
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1" disabled>
            <i className="far fa-envelope mr-2"></i>Email:{" "}
            {sessionUtils.getEmail()}
          </Dropdown.Item>
          <Dropdown.Item href="#/action-2" onClick={handleShowPassword}>
            <i className="fas fa-lock mr-2"></i>Change Password
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#/action-3" onClick={handleShowInvite}>
            <i className="fas fa-user-plus mr-2"></i>Invite Colleagues
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#/action-4" onClick={logout}>
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  } else {
    profile = (
      <div className="sign-x-buttons">
        <Button onClick={redirectToLogin} className="btn btn-primary ml-4">
          Login
        </Button>
        <Button onClick={redirectToSignup} className="btn btn-primary ml-2">
          Sign Up
        </Button>
      </div>
    );
  }

  let homeActive =
    window.location.href.indexOf("/about") === -1 &&
    window.location.href.indexOf("/numbers") === -1
      ? "active"
      : "";
  let aboutActive = window.location.href.indexOf("/about") > -1 ? "active" : "";
  let numbersActive =
    window.location.href.indexOf("/numbers") > -1 ? "active" : "";
  return (
    <div>
      <div className="page-header d-flex pr-3">
        <h3 className="flex-grow-1 gisp-header">
          <span>COVID-19 GP Information Sharing Portal</span>
        </h3>
        <CovidNumbers />
        {profile}
      </div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="nav nav-tabs mr-auto">
          <li className={homeActive}>
            <a className={"nav-link " + homeActive} href="/">
              Home
            </a>
          </li>
          <li className={aboutActive}>
            <a className={"nav-link " + aboutActive} href="/about">
              About GISP
            </a>
          </li>
          <li className={numbersActive}>
            <a className={"hide nav-link " + numbersActive} href="/numbers">
              UK COVID Numbers
            </a>
          </li>
        </ul>
        {search}
      </nav>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileUpload closeModal={handleClose} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInvite} onHide={handleCloseInvite}>
        <Modal.Header closeButton>
          <Modal.Title>Invite your colleagues</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InviteForm closeModal={handleCloseInvite} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInvite}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPassword} onHide={handleClosePassword}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChangePassword closeModal={handleClosePassword} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePassword}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/logout">
            <LoginForm />
          </Route>
          <Route path="/numbers">
            <NumbersPage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/documents/:folderName?">
            <Documents />
          </Route>
          <Route path="/">
            <LoginForm />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
