import './point.scss';

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
import { getEntity, updateEntity, createEntity, reset } from './points.reducer';
import { IPoints } from 'app/shared/model/points.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

export interface IPointsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IPointsUpdateState {
  isNew: boolean;
  userId: string;
}

export class PointsUpdate extends React.Component<IPointsUpdateProps, IPointsUpdateState> {
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
      values.excercise ? values.excercise = 1 : values.excercise = 0;
      values.meals ? values.meals = 1 : values.meals = 0;
      values.alcohol ? values.alcohol = 1 : values.alcohol = 0;
      const { pointsEntity } = this.props;
      const entity = {
        ...pointsEntity,
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
    this.props.history.goBack();
  };

  render() {
    const { pointsEntity, users, loading, updating, isAdmin } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="twentyOnePointsReactApp.points.home.createOrEditLabel">Create or edit a Points</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : pointsEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">ID</Label>
                    <AvInput id="points-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="dateLabel" for="date">
                    Date
                  </Label>
                  <AvField
                    id="points-date"
                    type="date"
                    className="form-control"
                    name="date"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup check>
                  <AvInput id="points-excercise" type="checkbox" name="excercise" />
                  <Label check for="excercise"> Excercise</Label>
                </AvGroup>
                <AvGroup check>
                  <AvInput id="points-meals" type="checkbox" name="meals" />
                  <Label check for="meals"> Meaks</Label>
                </AvGroup>
                <AvGroup check>
                  <AvInput id="points-alcohol" type="checkbox" name="alcohol" />
                  <Label check for="alcohol"> Alcohol</Label>
                </AvGroup>
                <AvGroup>
                  <Label id="notesLabel" for="notes">
                    Notes
                  </Label>
                  <AvField
                    id="points-notes"
                    type="text"
                    name="notes"
                    validate={{
                      maxLength: { value: 140, errorMessage: 'This field cannot be longer than {{ max }} characters.' }
                    }}
                  />
                </AvGroup>
                {isAdmin &&
                  <AvGroup>
                    <Label for="user.login">User</Label>
                    <AvInput id="points-user" type="select" className="form-control" name="userId">
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
                <Button id="cancel-save" color="info" onClick={this.handleClose}>
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
  pointsEntity: storeState.points.entity,
  loading: storeState.points.loading,
  updating: storeState.points.updating,
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
)(PointsUpdate);
