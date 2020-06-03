import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Main from './components/main';
import Detail from './components/detail';
import Crud from './components/crud/index'
import ButterToast,{ POS_RIGHT,POS_TOP } from "butter-toast";
import { MapContextProvider } from "./context/mapContext"

class App extends Component {
  render() {
    return (
      <Router>
          <MapContextProvider>
              <Route exact path="/" component={Main} />
              <Route path="/detail/:id" component={Detail} />
              <Route path="/crud" component={Crud} />
              <ButterToast position={{vertical:POS_TOP,horizontal:POS_RIGHT}}/>
          </MapContextProvider>
      </Router>
    )
  }
}

export default App;
