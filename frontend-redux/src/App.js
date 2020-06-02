import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Main from './components/main';
import Detail from './components/detail';
import PlaceList from './components/crud/PlaceList'
import ButterToast,{ POS_RIGHT,POS_TOP } from "butter-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route exact path="/" component={Main} />
          <Route path="/detail/:id" component={Detail} />
          <Route path="/crud" component={PlaceList} />
          <ButterToast position={{vertical:POS_TOP,horizontal:POS_RIGHT}}/>
        </Router>
      </Provider>
    )
  }
}

export default App;
