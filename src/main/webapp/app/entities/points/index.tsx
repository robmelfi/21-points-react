import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Points from './points';
import PointsDetail from './points-detail';
import PointsUpdate from './points-update';
import PointsDeleteDialog from './points-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PointsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PointsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PointsDetail} />
      <ErrorBoundaryRoute path={match.url} component={Points} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={PointsDeleteDialog} />
  </>
);

export default Routes;
