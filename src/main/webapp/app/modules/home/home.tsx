import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert, Progress } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getPointsThisWeek } from 'app/entities/points/points.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PointsHome from 'app/entities/points/points-home';
import BloodPressureHome from 'app/entities/blood-pressure/blood-pressure-home';
import WeigthHome from 'app/entities/weigth/weigth-home';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
    if (this.props.account && this.props.account.login) {
      this.getPointsThisWeek();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.pointsThisWeek.length === 0 ||
      this.props.pointsThisWeek.points !== prevProps.pointsThisWeek.points ||
      this.props.account.login !== prevProps.account.login) {
      this.getPointsThisWeek();
    }
  }

  getPointsThisWeek = () => {
    this.props.getPointsThisWeek();
  };

  render() {
    const { account, pointsThisWeek } = this.props;
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
              <PointsHome pointsThisWeek={pointsThisWeek}/>
              <BloodPressureHome/>
              <WeigthHome/>
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
  isAuthenticated: storeState.authentication.isAuthenticated,
  pointsThisWeek: storeState.points.pointsThisWeek
});

const mapDispatchToProps = {
  getSession,
  getPointsThisWeek
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
