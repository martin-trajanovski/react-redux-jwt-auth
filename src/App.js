import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { history } from './helpers';
// import { alertActions } from "../_actions";
import { PrivateRoute } from './components/privateRoute';
import { HomePage } from './components/homePage';
import { LoginPage } from './components/loginPage';
import { RegisterPage } from './components/registerPage';

class App extends React.Component {
  render() {
    // const { alert } = this.props;
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-sm-8 offset-sm-2">
            {/* {alert.message && (
              <div className={`alert ${alert.type}`}>{alert.message}</div>
            )} */}
            <Router history={history}>
              <div>
                <PrivateRoute exact path="/" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
              </div>
            </Router>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  alert: PropTypes.string
};

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert
  };
}

const connectedApp = connect(mapStateToProps)(App);
export default connectedApp;
