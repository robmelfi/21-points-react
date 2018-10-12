import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Weigth from './weigth';
import WeigthDetail from './weigth-detail';
import WeigthUpdate from './weigth-update';
import WeigthDeleteDialog from './weigth-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WeigthUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WeigthUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WeigthDetail} />
      <ErrorBoundaryRoute path={match.url} component={Weigth} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={WeigthDeleteDialog} />
  </>
);

export default Routes;
