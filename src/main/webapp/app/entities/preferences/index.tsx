import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Preferences from './preferences';
import PreferencesDetail from './preferences-detail';
import PreferencesUpdate from './preferences-update';
import PreferencesDeleteDialog from './preferences-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PreferencesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PreferencesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PreferencesDetail} />
      <ErrorBoundaryRoute path={match.url} component={Preferences} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={PreferencesDeleteDialog} />
  </>
);

export default Routes;
