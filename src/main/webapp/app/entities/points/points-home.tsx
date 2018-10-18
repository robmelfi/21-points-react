import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const pointsHome = props => (
  <div>
    <Row>
      <Col xs="8">
        <h4 className="mt-1 d-none d-sm-inline">Points for the week of {moment(props.pointsThisWeek.week).format('ll')}</h4>
        <h4 className="mt-1 d-sm-none">Points for {moment(props.pointsThisWeek.week).format('ll')}</h4>
      </Col>
      <Col md="3" xs="2" className="text-right">
        <Link to={`entity/points/new`} className="btn btn-primary m-0 mb-1 text-white">
          Add Points
        </Link>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col md="11" xs="12">
        <Progress striped
                  max="21"
                  hidden={!props.pointsThisWeek.points}
                  value={props.pointsThisWeek.points}>{props.pointsThisWeek.points} / Goal: {props.userWeeklyGoal}</Progress>
        { !props.pointsThisWeek.points && <Alert color="danger">No points yet this week, better get moving!</Alert>}
      </Col>
    </Row>
  </div>
);

export default pointsHome;
