import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './preferences.reducer';
import { IPreferences } from 'app/shared/model/preferences.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

export interface IPreferencesUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPreferencesUpdateState {
  isNew: boolean;
  userId: string;
}

export class PreferencesUpdate extends React.Component<IPreferencesUpdateProps, IPreferencesUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      userId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getUsers();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { preferencesEntity } = this.props;
      const entity = {
        ...preferencesEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/preferences');
  };

  render() {
    const { preferencesEntity, users, loading, updating, isAdmin } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="twentyOnePointsReactApp.preferences.home.createOrEditLabel">Create or edit a Preferences</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : preferencesEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="preferences-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="weeklyGoalLabel" for="weeklyGoal">
                    Weekly Goal
                  </Label>
                  <AvField
                    id="preferences-weeklyGoal"
                    type="string"
                    className="form-control"
                    name="weeklyGoal"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      min: { value: 10, errorMessage: 'This field should be at least {{ min }}.' },
                      max: { value: 21, errorMessage: 'This field cannot be more than {{ max }}.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="weightUnitsLabel">Weight Units</Label>
                  <AvInput
                    id="preferences-weightUnits"
                    type="select"
                    className="form-control"
                    name="weightUnits"
                    value={(!isNew && preferencesEntity.weightUnits) || 'KG'}
                  >
                    <option value="KG">KG</option>
                    <option value="LB">LB</option>
                  </AvInput>
                </AvGroup>
                {isAdmin &&
                  <AvGroup>
                    <Label for="user.login">User</Label>
                    <AvInput id="preferences-user" type="select" className="form-control" name="userId">
                      <option value="" key="0" />
                      {users
                        ? users.map(otherEntity => (
                            <option value={otherEntity.id} key={otherEntity.id}>
                              {otherEntity.login}
                            </option>
                          ))
                        : null}
                    </AvInput>
                  </AvGroup>
                }
                <Button tag={Link} id="cancel-save" to="/entity/preferences" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  preferencesEntity: storeState.preferences.entity,
  loading: storeState.preferences.loading,
  updating: storeState.preferences.updating,
  isAdmin: hasAnyAuthority(storeState.authentication.account.authorities, [AUTHORITIES.ADMIN])
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreferencesUpdate);
