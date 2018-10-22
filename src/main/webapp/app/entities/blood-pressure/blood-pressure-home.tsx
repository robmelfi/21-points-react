import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Row, Col, Alert, Progress } from 'reactstrap';

import { IBloodPressureChart } from 'app/shared/model/blood-pressure-chart';

export interface IBloodPressureHomeProp {
  bpChart: IBloodPressureChart;
}

class BloodPressureHome extends Component<IBloodPressureHomeProp> {

  render() {

    let graph = <Alert color="danger">No blood pressure readings found.</Alert>;
    if (this.props.bpChart.data.length !== 0) {
      graph = (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={this.props.bpChart.data}
                     margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="timestamp" interval={this.props.bpChart.interval}/>
            <YAxis
              label={{ value: this.props.bpChart.yAxis.label, angle: -90, position: 'insideLeft' }}
              type="number" domain={['dataMin-20', 'dataMax+20']} />
            <CartesianGrid strokeDasharray="5 5"/>
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line name="Systolic" type="monotone" dataKey="s" stroke="#330066" activeDot={{ r: 5 }}/>
            <Line name="Diastolic" type="monotone" dataKey="d" stroke="#0000FF" activeDot={{ r: 5 }}/>
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
