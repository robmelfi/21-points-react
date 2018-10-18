import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class WeigthHome extends Component {

  state = {
    values: false
  };

  render () {

    let graph = <Alert color="danger">No blood pressure readings found. [TO DO: graph]</Alert>;

    if (this.state.values) {
      graph = <span>Graph</span>;
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
