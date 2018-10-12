import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BloodPressure from './blood-pressure';
import BloodPressureDetail from './blood-pressure-detail';
import BloodPressureUpdate from './blood-pressure-update';
import BloodPressureDeleteDialog from './blood-pressure-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BloodPressureUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BloodPressureUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BloodPressureDetail} />
      <ErrorBoundaryRoute path={match.url} component={BloodPressure} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={BloodPressureDeleteDialog} />
  </>
);

export default Routes;
