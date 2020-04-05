import React from 'react';
import  { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';
import FolderService from '../services/FolderService';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        url: null,
        title: null,
        selectedFile: null,
        selectedFolder: null,
        selectedSubFolder: null,
        selectedFileName: '',
        showError: false,
        errorMessage: '',
        showSuccess: false,
        successMessage: '',
        topLevelFolders: [],
        subFolders: []
    };

    this.closeModal = props.closeModal.bind(this);

    this.fileChangeHandler = this.fileChangeHandler.bind(this);
    this.folderChangeHandler = this.folderChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.formChangeHandler = this.formChangeHandler.bind(this);
    this.getTopFolders = this.getTopFolders.bind(this);
    this.getSubFolders = this.getSubFolders.bind(this);
    this.subFolderChangeHandler = this.subFolderChangeHandler.bind(this);
  }

  componentDidMount() {
      this.getTopFolders();
  }

  fileChangeHandler(event) {
      this.setShowError(false);

      this.setState({
          selectedFile: event.target.files[0],
          selectedFileName: event.target.files[0].name
      });
  }

  folderChangeHandler(event) {
      const selectedFolder = event.target.value;
      this.getSubFolders(selectedFolder);
      this.setState({
          selectedFolder: selectedFolder
      });
  }

  subFolderChangeHandler(event) {
      const subFolder = event.target.value;
      this.setState({
          selectedSubFolder: subFolder
      });
  }

  formChangeHandler(event) {
      let state = {}
      state[event.target.name] = event.target.value;
      this.setState(state);
  }

  setShowError(state, message) {
      this.setState({showError: state, errorMessage: message});
  }

  setShowSuccess(state, message) {
      this.setState({showSuccess: state, successMessage: message});
  }

  isOnlineResources() {
      return this.state.selectedFolder === 'Online Resources';
  }

  getTopFolders() {
      FolderService.fetchFolders().then(folders => {
          this.setState({
              topLevelFolders: folders
          })
      });
  }

  getSubFolders(folderName) {
      FolderService.fetchFolders(folderName).then(folders => {
          this.setState({
              subFolders: folders
          })
      });
  }

  submitHandler(event) {
      event.preventDefault();
      this.setShowError(false);
      this.setShowSuccess(false);
      if (this.state.selectedFile && this.state.selectedFolder){
          const data = new FormData();
          data.append('file', this.state.selectedFile, this.state.selectedFile.name);
          data.append('folder', this.state.selectedFolder);
          const fileToUpload = this.state.selectedFolder + '/' + (this.state.selectedSubFolder ? this.state.selectedSubFolder + '/' : '') + encodeURIComponent(this.state.selectedFileName);
          fetch("https://3rscxpdnjh.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-uploadDocument?document=" + fileToUpload + "&mimeType=" + this.state.selectedFile.type + "&hash=" + sessionStorage.getItem('covid.loggedin'))
          .then(res => res.json())
          .then(res => {
              if (res.url){
                  axios.put(res.url, this.state.selectedFile).then(res => {
                      this.setShowSuccess(true, 'Upload successful, thank you for your contribution');
                      const that = this;
                      setTimeout(() => {
                          that.closeModal();
                      }, 3000);
                  }).catch(e => {
                      this.setShowError(true, 'Upload failed, please contact support or try again.');
                  });
              } else {
                  this.setShowError(true, 'Upload failed, please contact support or try again.');
              }
          }).catch(err => {
              this.setShowError(true, 'Upload failed, please contact support or try again.');
          });
      } else if (this.state.url && this.state.title && this.state.selectedFolder) {
          const folder = this.state.selectedFolder + (this.state.selectedSubFolder ? '/' + this.state.selectedSubFolder : '');
          const resource = {
              url: this.state.url,
              title: this.state.title,
              folder: folder
          }
          axios.post("https://3rscxpdnjh.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-uploadDocument", JSON.stringify(resource), {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                this.setShowSuccess(true, 'Upload successful, thank you for your contribution');
                const that = this;
                setTimeout(() => {
                    that.closeModal();
                }, 3000);
          });
      } else {
          this.setShowError(true, 'Please make sure to fill in all fields of the form');
      }
  }

  render() {
      if (!sessionStorage.getItem('covid.loggedin')){
            return <Redirect to='/' />
      } else {
          let errorBanner = '';
          if (this.state.showError){
              errorBanner = (<Alert key="error" variant="danger" onClose={(e) => this.setShowError(false)} dismissible>{this.state.errorMessage}</Alert>)
          }
          let successBanner = '';
          if (this.state.showSuccess){
              errorBanner = (<Alert key="success" variant="success" onClose={(e) => this.closeSuccess()} dismissible>{this.state.successMessage}</Alert>)
          }
          let fileOrUrl = ( <Tabs defaultActiveKey="file" id="uncontrolled-tab-example">
                                <Tab eventKey="file" title="File">
                                    <div className="form-group">
                                        <label htmlFor="documentToUpload">Document</label>
                                        <input type="file" name="documentToUpload" className="form-control" onChange={this.fileChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="fileName">File name</label>
                                        <input type="text" name="selectedFileName" className="form-control" onChange={this.formChangeHandler} value={this.state.selectedFileName} />
                                    </div>
                                </Tab>
                                <Tab eventKey="onlineResource" title="Online Resource">
                                    <div className="form-group">
                                        <label htmlFor="url">Resource URL</label>
                                        <input type="text" name="url" className="form-control" onChange={this.formChangeHandler} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="title">Resource Title</label>
                                        <input type="text" name="title" className="form-control" onChange={this.formChangeHandler} />
                                    </div>
                                </Tab>
                            </Tabs>);
          const topFolders = this.state.topLevelFolders.map(folder => {
              const folderName = folder.folderName.replace('/', '');
              return <option value={folderName} key={folderName}>{folderName}</option>
          });
          const subFolders = this.state.subFolders.map(folder => {
              const folderName = folder.folderName.replace('/', '');
              return <option value={folderName} key={folderName}>{folderName}</option>
          });
        return (
            <form className="form" onSubmit={this.submitHandler}>
                {errorBanner}
                {successBanner}
                <div className="form-group">
                    <label htmlFor="folder">Folder to upload to</label>
                    <select name="folder" className="form-control" onChange={this.folderChangeHandler}>
                        <option>Select one</option>
                        {topFolders}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subFolder">Sub folder</label>
                    <select name="subFolder" className="form-control" onChange={this.subFolderChangeHandler}>
                        <option></option>
                        {subFolders}
                    </select>
                </div>
                {fileOrUrl}
                <button type="submit" className="btn btn-primary" value="Upload">Upload</button>
            </form>
        );
    }
  }
}

export default FileUpload;
