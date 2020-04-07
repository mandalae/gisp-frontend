import React from 'react';
import  { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import sessionUtils from '../lib/session';

class InviteForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {emails: null, showError: false, showSuccess: false, badEmails: [], goodEmails: []};

    this.closeModal = props.closeModal.bind(this);
    this.valueChangeHandler = this.valueChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  setShowError(errorState) {
      this.setState({
          showError: errorState
      });
  }

  closeError() {
      this.setState({
          showError: false
      });
  }

  setShowSuccess(successState) {
      this.setState({
          showSuccess: successState
      });
  }

  closeSuccess() {
      this.setState({
          showSuccess: false
      });
  }

  valueChangeHandler(event) {
      this.setState({
          emails: event.target.value
      });
  }

  submitHandler(event) {
      event.preventDefault();

      console.log(this.state.emails);

      const emails = this.state.emails.split("\n");

      const goodEmails = emails.filter(email => {
          if (email.indexOf('nhs.uk') > -1 || email.indexOf('nhs.net') > -1 || email.indexOf('rpediem.dk') > -1){
              return email;
          }
          return null;
      });

      const badEmails = emails.filter(email => {
          if (goodEmails.indexOf(email) === -1){
              return email;
          }
          return null;
      });

      this.setState({badEmails: badEmails, goodEmails: goodEmails});

      if (badEmails.length > 0){
            this.setShowError(true);
      }

      if (goodEmails.length > 0){
          this.setShowSuccess(true);
          axios.post("https://3rscxpdnjh.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-Invite", JSON.stringify(goodEmails), {}).then(res => {
              const that = this;
              setTimeout(() => {
                  that.closeModal();
              }, 3000);
          });
      }

  }

  render() {
      if (!sessionUtils.isLoggedIn()){
            return <Redirect to='/' />
      } else {
          let errorBanner = '';
          if (this.state.showError){
              errorBanner = (<Alert key="error" variant="danger" onClose={(e) => this.closeError()} dismissible>These emails are not allowed: {this.state.badEmails.join(", ")}</Alert>)
          }
          let successBanner = '';
          if (this.state.showSuccess){
              errorBanner = (<Alert key="success" variant="success" onClose={(e) => this.closeSuccess()} dismissible>Invites have been sent to: {this.state.goodEmails.join(", ")}</Alert>)
          }
        return (
            <form className="form" onSubmit={this.submitHandler}>
                {errorBanner}
                {successBanner}
                <p>By filling in the form below an email will be sent to each email address with a link to this site and a password to match their email.</p>
                <p>This will allow them to log in and share in the information found. <strong>Note: emails have to have a .nhs.uk or .nhs.net domain.</strong></p>
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1">Add emails below, one per line</label>
                    <textarea className="form-control" id="inviteEmails" rows="5" placeholder="example@nhs.uk" onChange={this.valueChangeHandler}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" value="Invite">Invite</button>
            </form>
        );
    }
  }
}

export default InviteForm;
