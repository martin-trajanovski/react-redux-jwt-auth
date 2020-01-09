import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { userActions } from '../actions';
import { authActions } from '../actions';

class HomePage extends React.Component {
  componentDidMount() {
    this.props.getAllUsers();

    // NOTE: I am calling getAllUsers twice to test if after refreshToken all failed calls are resent. It works!
    setTimeout(() => {
      this.props.getAllUsers();
    }, 500);
  }

  handleDeleteUser(id) {
    return () => this.props.removeUser(id);
  }

  render() {
    const { user, users } = this.props;
    return (
      <div className="col-md-8 col-md-offset-2">
        <h1>Hi {user.firstName}!</h1>
        <p>You are logged in using JWT!!</p>
        <h3>All registered users:</h3>
        {users.loading && <em>Loading users...</em>}
        {users.error && (
          <span className="text-danger">ERROR: {users.error}</span>
        )}
        {users.items && (
          <ul>
            {users.items.map(user => (
              <li key={user._id}>
                {user.firstName + ' ' + user.lastName}
                {user.deleting ? (
                  <em> - Deleting...</em>
                ) : user.deleteError ? (
                  <span className="text-danger">
                    {' '}
                    - ERROR: {user.deleteError}
                  </span>
                ) : (
                  <span>
                    {' '}
                    -{' '}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={this.handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <p>
          <button
            className="btn btn-sm btn-primary"
            onClick={this.props.logoutUser}
          >
            Logout
          </button>
        </p>
      </div>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.shape({}),
  users: PropTypes.shape({}),
  getAllUsers: PropTypes.func,
  removeUser: PropTypes.func,
  logoutUser: PropTypes.func
};

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getAllUsers: () => dispatch(userActions.getAll()),
    removeUser: id => dispatch(userActions.delete(id)),
    logoutUser: () => dispatch(authActions.logout())
  };
};

const connectedHomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export { connectedHomePage as HomePage };
