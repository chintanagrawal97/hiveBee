import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import hiveMainPage from './shared/hive/hiveMainPage'
const history = createBrowserHistory();

function ApplicationRouter() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/hive" exact component={hiveMainPage} />
      </Switch>
    </Router>
  );
}

export default ApplicationRouter;

