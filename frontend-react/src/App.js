import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Main from './components/main';
import Detail from './components/detail';
import Crud from './components/crud/index'

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Main} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/crud" component={Crud} />
      </Router>
    )
  }
}

export default App;
