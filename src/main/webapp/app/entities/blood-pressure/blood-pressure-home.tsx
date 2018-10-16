import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class BloodPressureHome extends Component {
  render() {
    return (
      <div>
        <Row className="mt-4">
          <Col xs="6" className="text-nowrap">
            <h4 className="mt-1 d-none d-sm-inline">Blood Pressure:</h4>
            <h4 className="mt-1 d-sm-none">BP:</h4>
          </Col>
          <Col xs="6" className="text-right">
            <Link to={`/`} className="btn btn-outline-secondary btn-sm d-none d-sm-inline">
              <FontAwesomeIcon icon="plus" />&nbsp;Blood Pressure
            </Link>
            <Link to={`/`} className="btn btn-outline-secondary btn-sm d-sm-none">
              <FontAwesomeIcon icon="plus" />&nbsp;BP
            </Link>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col xs="12" md="11">
            Graph
          </Col>
        </Row>
      </div>
    );
  }
}

export default BloodPressureHome;
