import React from 'react';
import  { Redirect } from 'react-router-dom';

import FolderSection from './FolderSection';
import FolderService from '../services/FolderService';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            folder: null,
            previousFolderName: '',
            activeCases: 0,
            todayCases: 0,
            todayDeaths: 0,
            updated: 0
        };

        this.updateFolderName = this.updateFolderName.bind(this);
    }

    componentDidMount() {
        this.updateFolderName('');
        this.fetchCurrentNumbers();
    }

    updateFolderName(newFolder) {
        this.setState({
            folder: newFolder,
            documents: []
        });
    }

    fetchCurrentNumbers(){
      fetch('https://corona.lmao.ninja/countries/UK')
      .then(res => res.json())
      .then(data => {
          this.setState({
              activeCases: data.active,
              todayCases: data.todayCases,
              todayDeaths: data.todayDeaths,
              updated: data.updated
          });
          console.log(data);
      });
    }

    render() {
        if (!sessionStorage.getItem('covid.loggedin')){
            return <Redirect to='/' />
        } else {
            const dataUpdated = new Date(this.state.updated);
            const formattedDate = dataUpdated.getHours() + ':' + ('0' + dataUpdated.getMinutes()).slice(-2);
            const content = (
                <div>
                    <div className="">
                        <h4>Current UK COVID numbers</h4>
                        <h5>New Cases: {this.state.todayCases}</h5>
                        <h5>New Deaths: {this.state.todayDeaths}</h5>
                        <h5>Active Cases overall: {this.state.activeCases}</h5>
                        <p>Updated: {formattedDate}</p>
                    </div>
                </div>
            );
            return (
                <div className="container-fluid">
                    <FolderSection updateParentFolderName={this.updateFolderName} />
                    {content}
                </div>
            );
        }
    }
}

export default Documents;
