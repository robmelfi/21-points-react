import React from 'react';

import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Row, Col, Alert, Button } from 'reactstrap';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { IRootState } from 'app/shared/reducers';
import { handleRegister, reset } from './register.reducer';

export type IRegisterProps = DispatchProps;

export interface IRegisterState {
  password: string;
}

export class RegisterPage extends React.Component<IRegisterProps, IRegisterState> {
  state: IRegisterState = {
    password: ''
  };

  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handleRegister(values.username, values.email, values.firstPassword);
    event.preventDefault();
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  render() {
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1 id="register-title">Registration</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <AvForm id="register-form" onValidSubmit={this.handleValidSubmit}>
              <AvField
                name="username"
                label="Username"
                placeholder="Your username"
                validate={{
                  required: { value: true, errorMessage: 'Your username is required.' },
                  pattern: { value: '^[_.@A-Za-z0-9-]*$', errorMessage: 'Your username can only contain letters and digits.' },
                  minLength: { value: 1, errorMessage: 'Your username is required to be at least 1 character.' },
                  maxLength: { value: 50, errorMessage: 'Your username cannot be longer than 50 characters.' }
                }}
              />
              <AvField
                name="email"
                label="Email"
                placeholder="Your email"
                type="email"
                validate={{
                  required: { value: true, errorMessage: 'Your email is required.' },
                  minLength: { value: 5, errorMessage: 'Your email is required to be at least 5 characters.' },
                  maxLength: { value: 254, errorMessage: 'Your email cannot be longer than 50 characters.' }
                }}
              />
              <AvField
                name="firstPassword"
                label="New password"
                placeholder="New password"
                type="password"
                onChange={this.updatePassword}
                validate={{
                  required: { value: true, errorMessage: 'Your password is required.' },
                  minLength: { value: 4, errorMessage: 'Your password is required to be at least 4 characters.' },
                  maxLength: { value: 50, errorMessage: 'Your password cannot be longer than 50 characters.' }
                }}
              />
              <PasswordStrengthBar password={this.state.password} />
              <AvField
                name="secondPassword"
                label="New password confirmation"
                placeholder="Confirm the new password"
                type="password"
                validate={{
                  required: { value: true, errorMessage: 'Your confirmation password is required.' },
                  minLength: { value: 4, errorMessage: 'Your confirmation password is required to be at least 4 characters.' },
                  maxLength: { value: 50, errorMessage: 'Your confirmation password cannot be longer than 50 characters.' },
                  match: { value: 'firstPassword', errorMessage: 'The password and its confirmation do not match!' }
                }}
              />
              <Button id="register-submit" color="primary" type="submit">
                Register
              </Button>
            </AvForm>
            <p>&nbsp;</p>
            <Alert color="warning">
              <span>If you want to</span>
              <a className="alert-link"> sign in</a>
              <span>
                , you can try the default accounts:
                <br />- Administrator (login="admin" and password="admin")
                <br />- User (login="user" and password="user").
              </span>
            </Alert>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = { handleRegister, reset };
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(RegisterPage);
