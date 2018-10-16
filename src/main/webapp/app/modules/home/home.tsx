import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert, Progress } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { account } = this.props;
    return (
      <Row>
        <Col md="4" className="d-none d-md-inline">
          <span className="heart img-fluid rounded"/>
        </Col>
        <Col md="8">
          { account && account.login ? (
            <div>
              <h2>Welcome, {account.firstName}!</h2>
            </div>
          ) : (
            <div>
              <h2>Welcome!</h2>
            </div>
          )}
          <p className="lead"><span>21-Points Health is here to track your health and improve your life. 😊</span></p>
          {account && account.login ? (
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
              <Row className="mt-4">
                <Col xs="6" className="text-nowrap">
                  <h4 className="mt-1">Weight:</h4>
                </Col>
                <Col xs="6" className="text-right">
                  <Link to={`/`} className="btn btn-outline-secondary btn-sm">
                    <FontAwesomeIcon icon="plus" />&nbsp;Weight
                  </Link>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col xs="12" md="11">
                  Graph
                </Col>
              </Row>
              { account && <p>You are logged in as user {account.login}</p>}
            </div>
          ) : (
            <div>
              <p className="font-weight-bold">
                <span>To get started, please </span>
                <Link to="/login" className="alert-link">
                  <FontAwesomeIcon icon="sign-in-alt" />
                  {' '}
                  sign in
                </Link>
              </p>
              <p>
                <Link to="/about" className="btn btn-info d-none d-sm-inline text-white">
                  <span>Learn more about 21-Points Health</span>
                </Link>
                <Link to="/about" className="btn btn-info d-sm-none text-white">
                  <span>Learn more</span>
                </Link>
              </p>
              <p>If you have any question on JHipster:</p>
              <ul>
                <li>
                  <a href="http://www.jhipster-book.com" target="_blank" rel="noopener noreferrer">
                    JHipster Mini-Book Blog
                  </a>
                </li>
                <li>
                  <a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
                    JHipster on Stack Overflow
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/jhipster_book" target="_blank" rel="noopener noreferrer">
                    Contact @java_hipster on Twitter
                  </a>
                </li>
                <li>
                  <a href="https://github.com/mraible/21-points/issues" target="_blank" rel="noopener noreferrer">
                    Report an issue
                  </a>
                </li>
              </ul>

              <div>
                Don't have an account yet?&nbsp;
                <Link to="/register" className="alert-link">
                  Register a new account
                </Link>
              </div>
            </div>
          )}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
