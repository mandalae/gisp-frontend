import React from 'react';

class CovidNumbers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cases: 0,
            deaths: 0,
            recoveries: 0,
            critical: 0,
            todayDeaths: 0,
            updated: 0
        };

        this.fetchCurrentNumbers = this.fetchCurrentNumbers.bind(this);
    }

    componentDidMount() {
        this.fetchCurrentNumbers();
    }

    fetchCurrentNumbers(){
        fetch('https://corona.lmao.ninja/countries/UK')
        .then(res => res.json())
        .then(data => {
            this.setState({
                cases: data.cases,
                recoveries: data.recovered,
                deaths: data.deaths,
                updated: data.updated,
                critical: data.critical,
                todayDeaths: data.todayDeaths
            });
        });
    }

    render() {
        const dataUpdated = new Date(this.state.updated);
        const formattedDate = dataUpdated.getHours() + ':' + ('0' + dataUpdated.getMinutes()).slice(-2);
        return (
            <ul className="covid-numbers align-self-center">
                <li><i className="fas fa-procedures" title="Active cases"></i> {this.state.cases}</li>
                <li><i className="fas fa-cloud-rain" title="Number of deaths in the UK"></i> {this.state.deaths}</li>
                <li><i className="fas fa-bolt" title="Deaths today"></i> {this.state.todayDeaths > 0 ? this.state.todayDeaths : 'N/A'}</li>
                <li><i className="fas fa-history" title="Data last updated"></i> {formattedDate}</li>
                <li><a href="https://www.worldometers.info/coronavirus/country/uk/" target="_blank" rel="noopener noreferrer">Source</a></li>
            </ul>
        );
    }
}

export default CovidNumbers;
