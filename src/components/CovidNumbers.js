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

    parseJHUData(rawData) {
        const cases = this.findLastDataEntry(rawData.cases);
        const deaths = this.findLastDataEntry(rawData.deaths);
        const deathsToday = this.findDeathsToday(rawData.deaths);
        const lastUpdated = this.findLastUpdated(rawData.deaths);

        return {
            cases: cases,
            deaths: deaths,
            deathsToday: deathsToday,
            updated: lastUpdated
        }
    }

    findLastUpdated(obj) {
        return new Date(Object.keys(obj)[Object.keys(obj).length-1]);
    }

    findDeathsToday(objects) {
        const date = new Date();
        const yesterday = new Date(date.getTime() - 86400000);
        const previousDay = new Date(date.getTime() - (86400000*2));
        const todayDateString = (parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + ('' + date.getFullYear()).slice(-2);
        const yesterdayDateString = (parseInt(yesterday.getMonth()) + 1) + '/' + yesterday.getDate() + '/' + ('' + yesterday.getFullYear()).slice(-2);
        const previousDayDateString = (parseInt(previousDay.getMonth()) + 1) + '/' + previousDay.getDate() + '/' + ('' + previousDay.getFullYear()).slice(-2);

        if (objects[todayDateString] && objects[yesterdayDateString]){
            return parseInt(objects[todayDateString]) - parseInt(objects[yesterdayDateString])
        } else if (objects[yesterdayDateString] && objects[previousDayDateString]) {
            return parseInt(objects[yesterdayDateString]) - parseInt(objects[previousDayDateString])
        }
        return null;
    }

    findLastDataEntry(objects) {
        const date = new Date();
        const yesterday = new Date(date.getTime() - 86400000);
        const todayDateString = (parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + ('' + date.getFullYear()).slice(-2);
        const yesterdayDateString = (parseInt(yesterday.getMonth()) + 1) + '/' + yesterday.getDate() + '/' + ('' + yesterday.getFullYear()).slice(-2);
        return objects[todayDateString] ? objects[todayDateString] : objects[yesterdayDateString];
    }

    fetchCurrentNumbers(){
        fetch('https://corona.lmao.ninja/v2/historical/United%20Kingdom?lastdays=30')
        .then(res => res.json())
        .then(data => {
            const parsedData = this.parseJHUData(data.timeline);


            this.setState({
                cases: parsedData.cases,
                deaths: parsedData.deaths,
                updated: parsedData.updated,
                todayDeaths: parsedData.deathsToday
            });
        });
    }

    render() {
        const dataUpdated = new Date(this.state.updated);
        const formattedDate = (('0' + (parseInt(dataUpdated.getMonth()) + 1)).slice(-2)) + '/' + ('0' + dataUpdated.getDate()).slice(-2) + '/' + dataUpdated.getFullYear();
        return (
            <ul className="covid-numbers align-self-center">
                <li><i className="fas fa-procedures" title="Total cases"></i> {this.state.cases}</li>
                <li><i className="fas fa-cloud-rain" title="Number of deaths in the UK"></i> {this.state.deaths}</li>
                <li><i className="fas fa-bolt" title="Deaths today"></i> {this.state.todayDeaths > 0 ? this.state.todayDeaths : 'N/A'}</li>
                <li><i className="fas fa-history" title="Data last updated"></i> {formattedDate}</li>
                <li><a href="https://coronavirus.jhu.edu/map.html" target="_blank" rel="noopener noreferrer">Source</a></li>
            </ul>
        );
    }
}

export default CovidNumbers;
