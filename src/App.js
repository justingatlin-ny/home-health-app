import React, { Component } from "react";
import { hot } from "react-hot-loader";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // console.log(event.target.elements);
    // formData.append("file", document.querySelector("input#myfile"));
    const options = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    axios({
      method: "POST",
      url: "/storage/upload",
      data: formData,
      header: options.headers
    })
      .then(response => {
        console.log("axios .then", response.data);
      })
      .catch(err => {
        console.error("axios .catch", err);
      });
  };

  handleChange = event => {
    const elm = event.target;
    this.setState({ [elm.name]: elm.value });
  };

  render() {
    return (
      <div className="App">
        <h1>Collect Documents...</h1>
        <form
          name="upload"
          onSubmit={this.handleSubmit}
          method="POST"
          encType="multipart/form-data"
        >
          <input type="file" id="fileLIst" name="fileList" multiple></input>
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default hot(module)(App);
