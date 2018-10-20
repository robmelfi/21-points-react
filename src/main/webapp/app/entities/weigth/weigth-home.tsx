import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

class WeigthHome extends Component {

  state = {
    values: false
  };

  render () {

    const data = [
      { date: 'Sep 11', w: 90 },
      { date: 'Sep 12', w: 91 },
      { date: 'Sep 13', w: 92 },
      { date: 'Sep 14', w: 93 },
      { date: 'Sep 15', w: 94 },
      { date: 'Sep 16', w: 90 },
      { date: 'Sep 18', w: 85 },
      { date: 'Sep 19', w: 86 },
      { date: 'Sep 20', w: 87 },
      { date: 'Sep 21', w: 88 },
      { date: 'Sep 22', w: 89 },
      { date: 'Sep 23', w: 95 },
      { date: 'Sep 24', w: 95 },
      { date: 'Sep 25', w: 95 },
      { date: 'Sep 26', w: 95 },
      { date: 'Sep 27', w: 95 },
      { date: 'Sep 28', w: 90 },
      { date: 'Sep 29', w: 90 },
      { date: 'Sep 30', w: 90 },
      { date: 'Sep 31', w: 90 },
      { date: 'Oct 01', w: 70 },
      { date: 'Oct 02', w: 70 },
      { date: 'Oct 03', w: 70 },
      { date: 'Oct 04', w: 70 },
      { date: 'Oct 05', w: 70 },
      { date: 'Oct 06', w: 70 },
      { date: 'Oct 07', w: 70 },
      { date: 'Oct 08', w: 70 },
      { date: 'Oct 09', w: 70 },
      { date: 'Oct 10', w: 80 }
    ];

    let graph = <Alert color="danger">No blood pressure readings found. [TO DO: graph]</Alert>;

    if (data) {
      graph = (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}
                     margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <XAxis dataKey="date" interval={5}/>
            <YAxis type="number" domain={['dataMin-20', 'dataMax+20']} />
            <CartesianGrid strokeDasharray="5 5"/>
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Area name="weight" type="monotone" dataKey="w" stroke="#8884d8" fill="#FFFF00" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <div>
        <Row className="mt-4">
          <Col xs="6" className="text-nowrap">
            <h4 className="mt-1 d-sm-inline">Weight:</h4>
          </Col>
          <Col md="5" xs="6" className="text-right">
            <Link to={`/entity/weigth/new`} className="btn btn-outline-secondary btn-sm">
              Add Weight
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

export default WeigthHome;
