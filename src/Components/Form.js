import React from "react";
import axios from "axios";
import DocumentContainer from "../Components/DocumentContainer";

const replaceSpaces = (name) => name.replace(/[\s\/]/g, '-');

class Form extends React.Component {
    state = {
      fileList: [],
      uploadStatus: ''
    }

    componentDidMount() {
      this.setState({ fileList });
    }
    
    handleSubmit = event => {
        const formIsWorking = 'data-working';
        event.preventDefault();

        const body = document.body;
        
        const form = event.target;

        if (/true/.test(form.getAttribute(formIsWorking))) return undefined;

        const fileInputList = form.querySelectorAll('[type="file"]');
        const filePaths = {};
        let formData;
        fileInputList.forEach(input => {
          const path = input.getAttribute('data-path');
          const file = input.files && input.files.length ? input.files[0] : null; 
          if (file) {
            if (!formData) formData = new FormData();
            filePaths[file.name] = path;
            formData.append(path, file, replaceSpaces(file.name));
          }
        });

        if (!formData) {
          this.setState({ uploadStatus: 'No files selected...'})
          return false;
        }

        body.setAttribute('data-working', 'true');
        form.querySelectorAll('button, input').forEach(itm => itm.setAttribute('disabled', 'disabled'));
        form.setAttribute(formIsWorking, 'true');
      
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
          .then(res => {
            this.setState({ fileList: res.data });
          })
          .catch(err => {
            console.log('Promise.catch()', err);
          })
          .finally(() => {
            form.querySelectorAll('button, input').forEach(itm => itm.removeAttribute('disabled'));
            form.setAttribute(formIsWorking, 'false');
            body.setAttribute('data-working', 'false');
          })
      };
    
      handleChange = event => {
        const elm = event.target;
        this.setState({ [elm.name]: elm.value, uploadStatus: '' });
      };
      render() {
          return (
            <form
                name="upload"
                onSubmit={this.handleSubmit}
                method="POST"
                encType="multipart/form-data">
                    <legend>
                      <h1>Upload Application Documents...</h1>
                    </legend>
                    <div className="button">
                      <button>Send</button>
                      <span>{this.state.uploadStatus}</span>
                    </div>
                    <div className="instructions"><span className="checkmark">&#x2714;</span> = Uploaded and saved</div>
                    <DocumentContainer fileList={this.state.fileList} handleChange={this.handleChange} />
                    
                    <div className="button">
                      <button>Send</button>
                      <span>{this.state.uploadStatus}</span>
                    </div>
            </form>
          );
      }
      
}

export default Form;