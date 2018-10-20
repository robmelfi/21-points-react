import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class BloodPressureHome extends Component {

  render() {

    // const data = null;
    const data = [
      { date: 'Sep 11', s: 90, d: 110 },
      { date: 'Sep 12', s: 91, d: 111 },
      { date: 'Sep 13', s: 92, d: 112 },
      { date: 'Sep 14', s: 93, d: 113 },
      { date: 'Sep 15', s: 94, d: 114 },
      { date: 'Sep 16', s: 90, d: 110 },
      { date: 'Sep 18', s: 85, d: 101 },
      { date: 'Sep 19', s: 86, d: 102 },
      { date: 'Sep 20', s: 87, d: 103 },
      { date: 'Sep 21', s: 88, d: 104 },
      { date: 'Sep 22', s: 89, d: 105 },
      { date: 'Sep 23', s: 95, d: 115 },
      { date: 'Sep 24', s: 95, d: 115 },
      { date: 'Sep 25', s: 95, d: 115 },
      { date: 'Sep 26', s: 95, d: 115 },
      { date: 'Sep 27', s: 95, d: 115 },
      { date: 'Sep 28', s: 90, d: 105 },
      { date: 'Sep 29', s: 90, d: 105 },
      { date: 'Sep 30', s: 90, d: 105 },
      { date: 'Sep 31', s: 90, d: 105 },
      { date: 'Oct 01', s: 70, d: 90 },
      { date: 'Oct 02', s: 70, d: 90 },
      { date: 'Oct 03', s: 70, d: 90 },
      { date: 'Oct 04', s: 70, d: 90 },
      { date: 'Oct 05', s: 70, d: 90 },
      { date: 'Oct 06', s: 70, d: 90 },
      { date: 'Oct 07', s: 70, d: 90 },
      { date: 'Oct 08', s: 70, d: 90 },
      { date: 'Oct 09', s: 70, d: 90 },
      { date: 'Oct 10', s: 80, d: 90 }
    ];

    let graph = <Alert color="danger">No blood pressure readings found. [TO DO: graph]</Alert>;

    if (data) {
      graph = (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}
                     margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="date" interval={5}/>
            <YAxis type="number" domain={['dataMin-20', 'dataMax+20']} />
            <CartesianGrid strokeDasharray="5 5"/>
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line name="Diastolic" type="monotone" dataKey="d" stroke="#0000FF" activeDot={{ r: 5 }}/>
            <Line name="Systolic" type="monotone" dataKey="s" stroke="#330066" activeDot={{ r: 5 }}/>
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <div>
        <Row className="mt-4">
          <Col xs="6" className="text-nowrap">
            <h4 className="mt-1 d-none d-sm-inline">Blood Pressure:</h4>
            <h4 className="mt-1 d-sm-none">BP:</h4>
          </Col>
          <Col md="5" xs="6" className="text-right">
            <Link to={`/entity/blood-pressure/new`} className="btn btn-outline-secondary btn-sm">
             Add Blood Pressure
            </Link>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col xs="12" md="11">
            {graph}
          </Col>
        </Row>
      </div>
    );
  }
}

export default BloodPressureHome;
