import React from "react";
import { useState } from "react";
import session from "../lib/session";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export const ListItem = ({
  date,
  iconSrc,
  iconAltText,
  folderName,
  resourceName,
  children,
}) => {
  const [show, setShow] = useState(false);
  const [flagResourceState, dispatch] = React.useReducer(flagResourceReducer, {
    status: "idle",
    error: null,
  });
  const dateObject = new Date(date);

  const onFlagClick = () => {
    dispatch({ type: "started" });

    flagForDeletion(resourceName, folderName)
      .then((res) => res.json())
      .then(() => {
        dispatch({ type: "success" });
      })
      .catch(() => {
        dispatch({ type: "error" });
      });
  };

  const onClose = () => setShow(false);

  return (
    <React.Fragment>
      <div className="list-group-item list-group-item-action w-100">
        <span style={{ display: "inline-block", width: "100px" }}>
          <strong>
            {("0" + dateObject.getDate()).slice(-2) +
              "/" +
              ("0" + (parseInt(dateObject.getMonth()) + 1)).slice(-2) +
              "/" +
              dateObject.getFullYear()}
          </strong>
        </span>
        <img
          src={iconSrc}
          alt={iconAltText}
          width="20"
          height="20"
          style={{ margin: "0 5px 3px 20px" }}
        />
        {children}
        <span className="pull-right" onClick={() => setShow(true)}>
          <img
            src="/icons/flag.svg"
            alt="Flag for deletion"
            title="Flag for deletion"
            className="float-right"
            width="20"
            height="20"
          />
        </span>
      </div>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Flag for deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(flagResourceState.status === "idle" ||
            flagResourceState.status === "pending") &&
            "Are you sure you want to flag this resource for deletion?"}
          {flagResourceState.status === "resolved" &&
            "Thank you. Administrator will review your request shortly."}
          {flagResourceState.status === "rejected" &&
            "Sorry, something went wrong. Please try again later."}
        </Modal.Body>
        <Modal.Footer>
          {flagResourceState.status === "idle" && (
            <Button variant="secondary" onClick={onFlagClick}>
              Yes
            </Button>
          )}
          {flagResourceState.status === "pending" && (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: "5px" }}
              />
              Loading...
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

function flagResourceReducer(state, action) {
  switch (action.type) {
    case "error": {
      return {
        ...state,
        status: "rejected",
      };
    }
    case "success": {
      return {
        ...state,
        status: "resolved",
      };
    }
    case "started": {
      return {
        ...state,
        status: "pending",
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const flagForDeletion = (resourceName, folderName) => {
  const userEmail = session.getEmail();
  const mailOptions = {
    emailSubject: "GISP Resource flagged for deletion",
    emailText: `The following resource ${resourceName} from the folder ${folderName} was flagged for deletion by ${userEmail}`,
    emailHtml:
      `<p>The following resource</p>` +
      `<p><font color='red'><b>${resourceName}</b></font></p>` +
      `<p>from the folder</p>` +
      `<p><b>${folderName}</b></p>` +
      `<p>was flagged for deletion by ${userEmail}</p>`,
  };

  return fetch("https://api.gisp.org.uk/sendemail", {
    method: "POST",
    headers: {
      "X-Authorization": session.getJWTToken(),
    },
    body: JSON.stringify(mailOptions),
  });
};
