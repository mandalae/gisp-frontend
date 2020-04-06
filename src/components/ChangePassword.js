import React from 'react';
import  { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import cognitoUtils from '../lib/cognitoUtils';
import sessionUtils from '../lib/session';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {emails: null, showError: false, errorMessage: '', showSuccess: false, oldPassword: '', newPassword: '', newPassword2: '', passwordError: false};

    this.closeModal = props.closeModal.bind(this);
    this.valueChangeHandler = this.valueChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  setShowError(errorState, message) {
      this.setState({
          showError: errorState,
          errorMessage: message
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

  checkPassword() {

      const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

      if (this.state.newPassword.length > 0 && this.state.newPassword2.length > 0) {
          if (this.state.newPassword !== this.state.newPassword2){
              this.setState({
                  passwordError: true
              });
              this.setShowError(true, 'The two new passwords must match');
          } else if (!strongRegex.test(this.state.newPassword)) {
              console.log(strongRegex.test(this.state.newPassword));
              this.setState({
                  passwordError: true
              });
              this.setShowError(true, 'The new password must have 1 uppercase character, 1 lower case character, a number and be 8 characters long.');
          } else {
              this.setState({
                  passwordError: false
              });
              this.closeError();
          }
      }
  }

  valueChangeHandler(event) {
      let state = {}
      state[event.target.name] = event.target.value;
      this.setState(state);
      this.checkPassword();
  }

  submitHandler(event) {
      event.preventDefault();
      this.closeError();
      this.closeSuccess();

      if (this.state.oldPassword && this.state.newPassword && this.state.newPassword === this.state.newPassword2){
          const cognitoUser = cognitoUtils.createCognitoUser();
          cognitoUser.getSession((err, result) => {
              if (err || !result) {
                console.log(new Error('Failure getting Cognito session: ' + err));
                this.setShowError(true, 'No user found, please log out and try again');
                return
              }

              cognitoUser.changePassword(this.state.oldPassword, this.state.newPassword, function(err, result) {
                  if (err || !result) {
                      console.log(err);
                      this.setShowError(true, 'Failed to sign in, please check your old password is correct');
                      return;
                  }
                  this.showSuccess();
                  const that = this;
                  setTimeout(() => {
                      that.closeModal();
                  }, 2000);
              });
          });
      } else {
          this.showError();
      }
  }

  render() {
      if (!sessionUtils.isLoggedIn()){
            return <Redirect to='/' />
      } else {
          let errorBanner = '';
          if (this.state.showError){
              errorBanner = (<Alert key="error" variant="danger" onClose={(e) => this.closeError()} dismissible>{this.state.errorMessage}</Alert>)
          }
          let successBanner = '';
          if (this.state.showSuccess){
              errorBanner = (<Alert key="success" variant="success" onClose={(e) => this.closeSuccess()} dismissible>Password changed</Alert>)
          }
        return (
            <form className="form" onSubmit={this.submitHandler}>
                {errorBanner}
                {successBanner}
                <div className="form-group">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input type="password" className="form-control" onChange={this.valueChangeHandler} name="oldPassword" />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" className={"form-control" + (this.state.passwordError ? ' is-invalid' : (this.state.newPassword.length > 0 ? ' is-valid' : ''))} onKeyUp={this.valueChangeHandler} name="newPassword" />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword2">New Password again</label>
                    <input type="password" className={"form-control" + (this.state.passwordError ? ' is-invalid' : (this.state.newPassword2.length > 0 ? ' is-valid' : ''))}  onKeyUp={this.valueChangeHandler} name="newPassword2" />
                </div>
                <button type="submit" className="btn btn-primary" value="Change">Change</button>
            </form>
        );
    }
  }
}

export default ChangePassword;
