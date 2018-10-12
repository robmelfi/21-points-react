import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from '../header-components';

export const EntitiesMenu = props => (
  // tslint:disable-next-line:jsx-self-close
  <NavDropdown icon="th-list" name="Entities" id="entity-menu">
    <DropdownItem tag={Link} to="/entity/points">
      <FontAwesomeIcon icon="asterisk" />&nbsp;Points
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/weigth">
      <FontAwesomeIcon icon="asterisk" />&nbsp;Weigth
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/blood-pressure">
      <FontAwesomeIcon icon="asterisk" />&nbsp;Blood Pressure
    </DropdownItem>
    <DropdownItem tag={Link} to="/entity/preferences">
      <FontAwesomeIcon icon="asterisk" />&nbsp;Preferences
    </DropdownItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
