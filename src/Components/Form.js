import React from "react";
import axios from "axios";
import DocumentContainer from "../Components/DocumentContainer";

class Form extends React.Component {
    handleSubmit = event => {
        event.preventDefault();
        const form = event.target;
        const files = form.elements.fileList.files;
        const numFiles = files.length;
                
        const formData = new FormData(form);
        const options = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          new Promise((resolve, reject) => {
            if (numFiles) {
            const response = axios({
                method: "POST",
                url: "/storage/upload",
                data: formData,
                header: options.headers
              })
                .then(response => response.data)
                .catch(err => err);
            resolve(response);
            } else {
                reject("Please add files to upload.");
            }
          })
          .then(res => console.log('Promise.then()', res))
          .catch(err => console.log('Promise.catch()', err));
      };
    
      handleChange = event => {
        const elm = event.target;
        this.setState({ [elm.name]: elm.value });
      };
      render() {
          return (
            <form
                name="upload"
                onSubmit={this.handleSubmit}
                method="POST"
                encType="multipart/form-data">
                    <legend>
                      <h1>Upload Medicaid Documents...</h1>
                    </legend>
                    
                    <DocumentContainer handleChange={this.handleChange} />
                    
                    <div>
                      <button>Send</button>
                    </div>
            </form>
          );
      }
      
}

export default Form;