import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { getUrlParameter } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

export interface IPasswordResetFinishProps extends DispatchProps, RouteComponentProps<{ key: string }> {}

export interface IPasswordResetFinishState {
  password: string;
  key: string;
}

export class PasswordResetFinishPage extends React.Component<IPasswordResetFinishProps, IPasswordResetFinishState> {
  state: IPasswordResetFinishState = {
    password: '',
    key: getUrlParameter('key', this.props.location.search)
  };

  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetFinish(this.state.key, values.newPassword);
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  getResetForm() {
    return (
      <AvForm onValidSubmit={this.handleValidSubmit}>
        <AvField
          name="newPassword"
          label="New password"
          placeholder={'New password'}
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
            required: { value: true, errorMessage: 'Your confirmation password is required.' },
            minLength: { value: 4, errorMessage: 'Your confirmation password is required to be at least 4 characters.' },
            maxLength: { value: 50, errorMessage: 'Your confirmation password cannot be longer than 50 characters.' },
            match: { value: 'newPassword', errorMessage: 'The password and its confirmation do not match!' }
          }}
        />
        <Button color="success" type="submit">
          Validate new password
        </Button>
      </AvForm>
    );
  }

  render() {
    const { key } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="4">
            <h1>Reset password</h1>
            <div>{key ? this.getResetForm() : null}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = { handlePasswordResetFinish, reset };

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  null,
  mapDispatchToProps
)(PasswordResetFinishPage);
