import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './preferences.reducer';
import { IPreferences } from 'app/shared/model/preferences.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPreferencesDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class PreferencesDetail extends React.Component<IPreferencesDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { preferencesEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Preferences [<b>{preferencesEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="weeklyGoal">Weekly Goal</span>
            </dt>
            <dd>{preferencesEntity.weeklyGoal}</dd>
            <dt>
              <span id="weightUnits">Weight Units</span>
            </dt>
            <dd>{preferencesEntity.weightUnits}</dd>
            <dt>User</dt>
            <dd>{preferencesEntity.userLogin ? preferencesEntity.userLogin : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/preferences" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/preferences/${preferencesEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ preferences }: IRootState) => ({
  preferencesEntity: preferences.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreferencesDetail);
