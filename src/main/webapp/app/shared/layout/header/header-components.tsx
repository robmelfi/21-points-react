import React from 'react';

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faStar);

import appConfig from 'app/config/constants';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      <FontAwesomeIcon icon={props.icon} />
      <span>{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-21-points.png" alt="Logo" />
  </div>
);

export const Brand = props => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">21-Points Health</span>
    <span className="navbar-version">v{appConfig.VERSION}</span>
  </NavbarBrand>
);

export const Home = props => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon="home" />
      <span>Home</span>
    </NavLink>
  </NavItem>
);

export const About = props => (
  <NavItem>
    <NavLink tag={Link} to="/about" className="d-flex align-items-center">
      <FontAwesomeIcon icon={faStar} />
      <span>About</span>
    </NavLink>
  </NavItem>
);

export const History = props => (
  <NavItem>
    <NavLink tag={Link} to="/history" className="d-flex align-items-center">
      <FontAwesomeIcon icon={faCalendarAlt} />
      <span>History</span>
    </NavLink>
  </NavItem>
);
