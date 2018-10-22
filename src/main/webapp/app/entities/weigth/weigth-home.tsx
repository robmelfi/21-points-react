import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

import { Row, Col, Alert, Progress } from 'reactstrap';

import { IWeigthChart } from 'app/shared/model/weigth-chart';

export interface IWeigthHomeProp {
  weigthChart: IWeigthChart;
}

class WeigthHome extends Component<IWeigthHomeProp> {

  render () {

    let graph = <Alert color="danger">No blood pressure readings found. [TO DO: graph]</Alert>;

    if (this.props.weigthChart.data.length !== 0) {
      graph = (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={this.props.weigthChart.data}
                     margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="timestamp" interval={this.props.weigthChart.interval}/>
            <YAxis
              label={{ value: this.props.weigthChart.yAxis.label, angle: -90, position: 'insideLeft' }}
              type="number" domain={['dataMin-20', 'dataMax+20']} />
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
