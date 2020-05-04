import React from "react";
import { useState } from "react";
import session from "../lib/session";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

import Dropdown from "react-bootstrap/Dropdown";

export const FeedbackDropdownItem = ({ href }) => {
  const [show, setShow] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const [feedbackState, dispatch] = React.useReducer(feedbackReducer, {
    status: "idle",
  });

  const onFeedbackClick = () => {
    setShow(true);
  };

  const onClose = () => {
    setShow(false);
    dispatch({ type: "reset" });
  };

  const onSubmitClick = (event) => {
    dispatch({ type: "started" });

    sendFeedback(feedbackText)
      .then((res) => res.json())
      .then(() => {
        dispatch({ type: "success" });
        setFeedbackText("");
      })
      .catch(() => {
        dispatch({ type: "error" });
      });
  };

  const modalWindow = (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Feedback form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(feedbackState.status === "idle" ||
          feedbackState.status === "pending") && (
          <Form>
            <Form.Group controlId="FeedbackForm.FeedbackText">
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Please leave your feedback here"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                disabled={feedbackState.status === "pending"}
              />
            </Form.Group>
          </Form>
        )}
        {feedbackState.status === "resolved" &&
          "Thank you. We have received your feedback."}
        {feedbackState.status === "rejected" &&
          "Sorry, something went wrong. Please try again later."}
      </Modal.Body>
      <Modal.Footer>
        {feedbackState.status === "idle" && (
          <Button
            variant="secondary"
            onClick={onSubmitClick}
            disabled={!feedbackText.length}
          >
            Submit
          </Button>
        )}
        {feedbackState.status === "pending" && (
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
  );

  return (
    <React.Fragment>
      <Dropdown.Item href={href} onClick={onFeedbackClick}>
        <i class="fas fa-comment-dots mr-2"></i>Leave Feedback
      </Dropdown.Item>
      {modalWindow}
    </React.Fragment>
  );
};

function feedbackReducer(state, action) {
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
    case "reset": {
      return {
        ...state,
        status: "idle",
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const sendFeedback = (text) => {
  const userEmail = session.getEmail();
  const mailOptions = {
    emailSubject: "GISP Feedback",
    emailText: `${userEmail} sent the following feedback: ${text}`,
    emailHtml: `<p><b>${userEmail}</b> sent the following feedback:</p><p>${text}</p>`,
  };

  return fetch("https://api.gisp.org.uk/sendemail", {
    method: "POST",
    headers: {
      "X-Authorization": session.getJWTToken(),
    },
    body: JSON.stringify(mailOptions),
  });
};
