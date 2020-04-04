import React from 'react';
import CovidChart from './CovidChart';

class NumbersPage extends React.Component {

  render() {
    return (
        <div className="wrapper">
            <div className="jumbotron">
                <CovidChart />
            </div>
        </div>
    );
  }
}

export default NumbersPage;
