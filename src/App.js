import Amplify, { Auth } from '@aws-amplify/auth';
import { withAuthenticator } from 'aws-amplify-react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

import React, { Component } from "react";
import { hot } from "react-hot-loader";
import GlobalStyles from './Components/GlobalStyles';
import Form from './Components/Form';

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

export default hot(module)(withAuthenticator(App));
