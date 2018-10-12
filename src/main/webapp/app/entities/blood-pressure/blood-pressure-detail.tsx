import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './blood-pressure.reducer';
import { IBloodPressure } from 'app/shared/model/blood-pressure.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBloodPressureDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class BloodPressureDetail extends React.Component<IBloodPressureDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { bloodPressureEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            BloodPressure [<b>{bloodPressureEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="timestamp">Timestamp</span>
            </dt>
            <dd>
              <TextFormat value={bloodPressureEntity.timestamp} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="systolic">Systolic</span>
            </dt>
            <dd>{bloodPressureEntity.systolic}</dd>
            <dt>
              <span id="diastolic">Diastolic</span>
            </dt>
            <dd>{bloodPressureEntity.diastolic}</dd>
            <dt>User</dt>
            <dd>{bloodPressureEntity.userLogin ? bloodPressureEntity.userLogin : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/blood-pressure" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/blood-pressure/${bloodPressureEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ bloodPressure }: IRootState) => ({
  bloodPressureEntity: bloodPressure.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BloodPressureDetail);
