import React from 'react';
import {Line} from 'react-chartjs-2';

let graphData = {
  labels: [],
  datasets: [
    {
      label: 'Cases',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
  },
  {
    label: 'Deaths',
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(197,52,52,0.4)',
    borderColor: 'rgba(197,52,52,1)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(197,52,52,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: []
  }
  ]
};

class CovidChart extends React.Component {
    constructor(props) {
        super(props);

        this.fetchCurrentNumbers = this.fetchCurrentNumbers.bind(this);
    }

    componentDidMount() {
        this.fetchCurrentNumbers();
    }

    fetchCurrentNumbers(){
        fetch('https://corona.lmao.ninja/v2/historical/UK')
        .then(res => res.json())
        .then(data => {
            const labels = Object.keys(data.timeline.cases);
            const cases = Object.values(data.timeline.cases);
            const deaths = Object.values(data.timeline.deaths);
            graphData.labels = labels;
            graphData.datasets[0].data = cases;
            graphData.datasets[1].data = deaths;
        });
    }

    render() {
        return (
            <div className="w-100 pr-3">
              <h2>UK COVID-19 numbers over time</h2>
              <Line data={graphData} />
            </div>
        );
    }


};
export default CovidChart;
