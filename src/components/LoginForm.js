import React from 'react';
import  { Redirect } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {email: '', password: '', showError: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setShowError = this.setShowError.bind(this);
    this.closeError = this.closeError.bind(this);
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

  handleChange(event) {
    if (event.target.name === 'email'){
        this.setState({email: event.target.value});
    } else {
        this.setState({password: event.target.value});
    }
  }

  handleSubmit(event) {
      event.preventDefault();

      fetch("https://bu2fba9fz7.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-Credentials?email=" + this.state.email + "&password=" + this.state.password)
        .then(res => res.json())
        .then(
          result => {
            if (result.loggedin === true) {
                sessionStorage.setItem('covid.loggedin', result.hash);
                window.location.reload(false);
            } else {
                this.setShowError(true);
            }
          },
          (error) => {
            console.log(error);
            this.setShowError(true);
          }
      );
  }

  render() {
      if (sessionStorage.getItem('covid.loggedin')){
          return <Redirect to='/documents' />
      } else {
        let errorBanner = '';
        if (this.state.showError){
          errorBanner = (<Alert key="error" variant="danger" onClose={(e) => this.closeError()} dismissible>Credentials were incorrect, please try again.<br />Please note that both email and password are case sensitive, so make sure they match what's in your invitation email.</Alert>)
        }
        return (
            <div className="col-12">
                <div className="jumbotron">
                    <p>This facility aims to provide a way to share good practice and helpful ideas for GPs. It is intended to help aid and speed up our ability to develop advice for patients, working procedures, practice protocols etc at this time of national crisis caused by the Coronavirus pandemic.</p>
                    <div className="row justify-content-md-center mb-3">
                        <div className="col-2"></div>
                        <div className="col-8">
                            {errorBanner}
                            <form onSubmit={this.handleSubmit}>
                              <div className="form-group">
                                <label htmlFor="inputEmail">Email address (Case sensitive)</label>
                                <input type="email" className="form-control" id="inputEmail" name="email" value={this.state.email} onChange={this.handleChange} aria-describedby="emailHelp" placeholder="Enter email" />
                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                              </div>
                              <div className="form-group">
                                <label htmlFor="inputPassword">Password (Case sensitive)</label>
                                <input type="password" className="form-control" id="inputPassword" name="password"  value={this.state.pasword} onChange={this.handleChange} placeholder="Password" />
                              </div>
                              <button type="submit" className="btn btn-primary">Log in</button>
                            </form>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    <h4>Disclaimer</h4>
                    <ul>
                        <li>This resource is for use by qualified medical professionals only, to share protocols, advice sheets, patient information, administrative procedures etc for use freely by other users of the service</li>
                        <li>Uploaded content must not contain any patient details or data. </li>
                        <li>Fair use policy applies. </li>
                        <li>The facility is provided 'as is' and there is no guarantee of service. </li>
                        <li>It is provided on a free, not for profit basis and it is not affiliated with or endorsed by any NHS body or organisation. </li>
                        <li>Anyone using the facility does so at own risk and is responsible for checking the veracity and validity of any information contained herein.</li>
                        <li>The owner and operator of the site accepts no liability for the content uploaded and available on the site provided by other users. </li>
                    </ul>
                </div>
            </div>
        );
    }
  }
}

export default LoginForm;
