import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert, Progress, Button } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getUserWeeklyGoal, getEntities } from 'app/entities/preferences/preferences.reducer';
import { getEntitiesLast30Days as getBloodPressureLast30Days } from 'app/entities/blood-pressure/blood-pressure.reducer';
import { getEntitiesLast30Days as getWeigthLast30Days } from 'app/entities/weigth/weigth.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PointsHome from 'app/entities/points/points-home';
import BloodPressureHome from 'app/entities/blood-pressure/blood-pressure-home';
import WeigthHome from 'app/entities/weigth/weigth-home';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
    if (this.props.isAuthenticated) {
      this.getUserWeeklyGoal();
      this.props.getEntities();
      this.props.getBloodPressureLast30Days();
      this.props.getWeigthLast30Days();
    }
  }

  componentDidUpdate(prevProps) {

    if (this.props.isAuthenticated) {

      if (this.props.pointsThisWeek.points !== prevProps.pointsThisWeek.points ||
          this.props.account.login !== prevProps.account.login) {
            this.getUserWeeklyGoal();
      }

      if (this.props.preferences.length !== prevProps.preferences.length ||
          this.props.account.login !== prevProps.account.login) {
            this.props.getEntities();
      }

      if (this.props.bpChart.data.length !== prevProps.bpChart.data.length ||
          this.props.account.login !== prevProps.account.login) {
            this.props.getBloodPressureLast30Days();
      }

      if (this.props.weigthChart.data.length !== prevProps.weigthChart.data.length ||
        this.props.account.login !== prevProps.account.login) {
        this.props.getWeigthLast30Days();
      }
    }
  }

  getUserWeeklyGoal = () => {
    this.props.getUserWeeklyGoal();
  };

  render() {

    const { account, pointsThisWeek, userWeeklyGoal, preferences, bpChart, weigthChart } = this.props;
    return (
      <Row>
        <Col md="4" className="d-none d-md-inline">
          <span className="heart img-fluid rounded"/>
        </Col>
        <Col md="8">
          { account && account.login ? (
            <div>
              <h1>Welcome, {account.firstName}!</h1>
            </div>
          ) : (
            <div>
              <h1>Welcome!</h1>
            </div>
          )}
          <p className="lead"><span>21-Points Health is here to track your health and improve your life. 😊</span></p>
          {account && account.login ? (
            <div>
              <PointsHome pointsThisWeek={pointsThisWeek} userWeeklyGoal={userWeeklyGoal}/>
              <BloodPressureHome bpChart={bpChart}/>
              <WeigthHome weigthChart={weigthChart}/>
              {preferences.length !== 0 &&
                <Row>
                  <Col md="11" xs="12" className="mt-2">
                    <Link to={`entity/preferences/${preferences[0].id}/edit`} className="float-right">
                      <span className="d-none d-md-inline">Edit Preferences</span>
                    </Link>
                    <Link to={`/`}>
                      <span className="d-none d-md-inline">View History</span>
                    </Link>
                  </Col>
                </Row>
              }
              { account && <p className="mt-2">You are logged in as user <em>{account.login}</em></p>}
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
              <p>If you have any questions about the JHipster Mini-Book or 21-Points Health:</p>
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
  pointsThisWeek: storeState.points.pointsThisWeek,
  userWeeklyGoal: storeState.preferences.userWeeklyGoal,
  preferences: storeState.preferences.entities,
  bpChart: storeState.bloodPressure.bpChart,
  weigthChart: storeState.weigth.wChart
});

const mapDispatchToProps = {
  getSession,
  getUserWeeklyGoal,
  getEntities,
  getBloodPressureLast30Days,
  getWeigthLast30Days
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
