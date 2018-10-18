import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Tooltip } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudSearchAction, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './preferences.reducer';
import { IPreferences } from 'app/shared/model/preferences.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export interface IPreferencesProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IPreferencesState {
  search: string;
  tooltipOpen: boolean;
}

export class Preferences extends React.Component<IPreferencesProps, IPreferencesState> {
  state: IPreferencesState = {
    search: '',
    tooltipOpen: false
  };

  componentDidMount() {
    this.props.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  render() {
    const { preferencesList, match, isAdmin } = this.props;

    let createSearchGroup = null;

    if (preferencesList.length === 0 || isAdmin) {
      createSearchGroup = (
        <InputGroup>
          <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch}
                   placeholder="Search"/>
          <Button className="input-group-addon">
            <FontAwesomeIcon icon="search"/>
          </Button>&nbsp;
          <Button type="reset" className="input-group-addon" onClick={this.clear}>
            <FontAwesomeIcon icon="trash"/>
          </Button>&nbsp;
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity"
                id="jh-create-entity">
            <FontAwesomeIcon icon="plus"/>
          </Link>
          <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="jh-create-entity"
                   toggle={this.toggleTooltip}>
            Set Preferences
          </Tooltip>
        </InputGroup>
      );
    }

    return (
      <div>
        <Row>
          <Col sm="8">
            <h2 id="preferences-heading">
              Preferences
            </h2>
          </Col>
          <Col sm="4">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                { createSearchGroup }
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Weekly Goal</th>
                <th>Weight Units</th>
                <th>{isAdmin ? "User" : null}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {preferencesList.map((preferences, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${preferences.id}`} color="link" size="sm">
                      {preferences.id}
                    </Button>
                  </td>
                  <td>{preferences.weeklyGoal}</td>
                  <td>{preferences.weightUnits}</td>
                  <td>{preferences.userLogin && isAdmin ? preferences.userLogin : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${preferences.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${preferences.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${preferences.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, preferences }: IRootState) => ({
  preferencesList: preferences.entities,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN])
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences);
