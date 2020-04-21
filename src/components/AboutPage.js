import React from 'react';

class AboutPage extends React.Component {

  render() {
    return (
        <div className="col-12">
            <div className="disclaimer col-12">
                <div className="jumbotron">
                    <h2>What is GISP?</h2>
                    <p> GISP is the brainchild of Stewarton GP Stewart Wilkie in response to the need for GPs to have easy access to the most relevant and accurate information regarding COVID19.
                        <br /><br />
                        Designed and built by IT software engineer Chris Skaaning, under the watchful eye of his wife (and content contributor), Irvine GP Jocelyn Skaaning, GISP has attracted over 900 registered users in its first week.
                        <br /><br />
                        The site has been built as quickly as possible to respond to need and is very much a work in progress. We will endeavour to keep documents up to date and would encourage members to upload new relevant resources.
                        <br /><br />
                        All feedback is welcomed. There is a Facebook group specifically for this purpose at <a href="https://www.facebook.com/groups/2663605157100534/?ref=share"><i className="fa fa-facebook-f"></i> GP Information Sharing Portal (Facebook)</a>
                    </p>
                </div>
                <div className="row panel">
                    <div className="card">
                        <img src="/stewart-small.jpg" alt="Stewart Wilkie" style={{width:100 + '%'}} />
                        <h3>Dr Stewart Wilkie</h3>
                        <p className="title">General Practitioner</p>
                        <p>Stewarton Medical Practice</p>
                        <a href="/about">&nbsp;</a>
                    </div>
                    <div className="card">
                        <img src="/joss-small.jpg" alt="Jocelyn Skaaning" style={{width:100 + '%'}} />
                        <h3>Dr Jocelyn Skaaning</h3>
                        <p className="title">General Practitioner</p>
                        <p>Frew Terrace Medial Practice</p>
                        <a href="https://www.linkedin.com/in/jocelyn-skaaning-1b80508b/"><i className="fa fa-linkedin"></i></a>
                    </div>
                    <div className="card">
                        <img src="/chris-small.jpg" alt="Chris Skaaning" style={{width:100 + '%'}} />
                        <h3>Chris Skaaning</h3>
                        <p className="title">Software Engineer</p>
                        <p>Lead Developer, GISP</p>
                        <a href="https://www.linkedin.com/in/chris-skaaning-0a99b43/"><i className="fa fa-linkedin"></i></a>
                    </div>
                    <div className="card">
                        <img src="/alex.jpg" alt="Alexander Gagarin" style={{width:100 + '%'}}  widtt="298" height="298" />
                        <h3>Alex Gagarin</h3>
                        <p className="title">Engineer</p>
                        <p>Product Development, GISP</p>
                        <a href="https://www.linkedin.com/in/alexander-gagarin/"><i className="fa fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default AboutPage;
