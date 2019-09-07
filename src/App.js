import React, { Component } from "react";
import { hot } from "react-hot-loader";
import GlobalStyles from './Components/GlobalStyles';
import Form from './Form';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <GlobalStyles />
        <Form />
      </div>
    );
  }
}

export default hot(module)(App);
