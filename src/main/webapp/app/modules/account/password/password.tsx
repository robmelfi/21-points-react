import React from 'react';

import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Row, Col, Button } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { savePassword, reset } from './password.reducer';

export interface IUserPasswordProps extends StateProps, DispatchProps {}

export interface IUserPasswordState {
  password: string;
}

export class PasswordPage extends React.Component<IUserPasswordProps, IUserPasswordState> {
  state: IUserPasswordState = {
    password: ''
  };

  componentDidMount() {
    this.props.reset();
    this.props.getSession();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.savePassword(values.currentPassword, values.newPassword);
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { account } = this.props;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="password-title">Password for {account.login}</h2>
            <AvForm id="password-form" onValidSubmit={this.handleValidSubmit}>
              <AvField
                name="currentPassword"
                label="Current password"
                placeholder="Current password"
                type="password"
                validate={{
                  required: { value: true, errorMessage: 'Your password is required.' }
                }}
              />
              <AvField
                name="newPassword"
                label="New password"
                placeholder="New password"
                type="password"
                validate={{
                  required: { value: true, errorMessage: 'Your password is required.' },
                  minLength: { value: 4, errorMessage: 'Your password is required to be at least 4 characters.' },
                  maxLength: { value: 50, errorMessage: 'Your password cannot be longer than 50 characters.' }
                }}
                onChange={this.updatePassword}
              />
              <PasswordStrengthBar password={this.state.password} />
              <AvField
                name="confirmPassword"
                label="New password confirmation"
                placeholder="Confirm the new password"
                type="password"
                validate={{
                  required: {
                    value: true,
                    errorMessage: 'Your confirmation password is required.'
                  },
                  minLength: {
                    value: 4,
                    errorMessage: 'Your confirmation password is required to be at least 4 characters.'
                  },
                  maxLength: {
                    value: 50,
                    errorMessage: 'Your confirmation password cannot be longer than 50 characters.'
                  },
                  match: {
                    value: 'newPassword',
                    errorMessage: 'The password and its confirmation do not match!'
                  }
                }}
              />
              <Button color="success" type="submit">
                Save
              </Button>
            </AvForm>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession, savePassword, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordPage);
