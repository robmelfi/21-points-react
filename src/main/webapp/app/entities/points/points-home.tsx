import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PointsHome extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs="8">
            <h5 className="mt-1 d-none d-sm-inline">Points for the week of {'{dynamic content}'}</h5>
            <h6 className="mt-1 d-sm-none">Points for {'{dynamic content}'}</h6>
          </Col>
          <Col xs="4" className="text-right">
            <Link to={`entity/points/new`} className="btn btn-primary m-0 mb-1 text-white d-none d-sm-inline">
              <FontAwesomeIcon icon="plus" />&nbsp;Points
            </Link>
            <Link to={`entity/points/new`} className="btn btn-primary m-0 mb-1 text-white d-sm-none">
              <FontAwesomeIcon icon="plus" />
            </Link>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="12">
            <Progress striped value="25">3 / Goal: 10</Progress>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PointsHome;
