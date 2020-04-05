import React from 'react';
import  { Redirect } from 'react-router-dom';

import FolderSection from './FolderSection';
import FolderService from '../services/FolderService';

class Documents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            documents: [],
            folder: null,
            previousFolderName: '',
            onlineResources: []
        };

        this.updateFolderName = this.updateFolderName.bind(this);
        this.fetchDocuments = this.fetchDocuments.bind(this);
    }

    componentDidMount() {
        this.updateFolderName('');
    }

    updateFolderName(newFolder) {
        this.setState({
            folder: newFolder,
            documents: []
        });
        this.fetchDocuments(newFolder);
    }

  fetchDocuments(folder) {
      FolderService.fetchDocuments(folder.folderKey).then(documents => {
          this.setState({
              previousFolderName: sessionStorage.getItem('covid.previousFolder'),
              documents: documents
          });
      });
  }

  downloadDocument(event, itemName) {
      event.preventDefault();

      fetch("https://3rscxpdnjh.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-getDocument?document=" + encodeURIComponent(itemName) + "&hash=" + sessionStorage.getItem('covid.loggedin'))
        .then(res => res.json())
        .then(
          (data) => {
              window.location = data.url;
          },
          (error) => {
            console.log(error);
          }
        )
  }

  render() {
      if (!sessionStorage.getItem('covid.loggedin')){
            return <Redirect to='/' />
      } else {
          let content = '';
          if (this.state.documents.length > 0){
            const documents = [].concat(this.state.documents)
                .sort((a, b) => {
                    const aDate = new Date(a.LastModified || a.lastUpdated);
                    const bDate = new Date(b.LastModified || b.lastUpdated);
                    return bDate.getTime() - aDate.getTime();
                })
                .map((item, key) => {
                    if (this.state.folder && this.state.folder.folderName !== ''){
                        if (item.Key && item.Key.indexOf('/') !== item.Key.length-1){
                            const lastModified = new Date(item.LastModified);
                            return <a className="list-group-item list-group-item-action w-100" key={item.ETag} href="/documents" onClick={e => this.downloadDocument(e, item.Key)}><strong>{('0' + lastModified.getDate()).slice(-2) + '/' + ('0' + (parseInt(lastModified.getMonth())+1)).slice(-2) + '/' + lastModified.getFullYear()}</strong> - {item.Key.replace(this.state.folder.folderName.replace('_', ' ') + '/', '').replace(this.state.previousFolderName + '/', '')}</a>
                        } else if (item.url) {
                            const lastModified = new Date(item.lastUpdated);
                            return <a title="This link will open in a new page" className="list-group-item list-group-item-action w-100" key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"><strong>{('0' + lastModified.getDate()).slice(-2) + '/' + ('0' + (parseInt(lastModified.getMonth())+1)).slice(-2) + '/' + lastModified.getFullYear()}</strong> - {item.title} <img src="/icons/newpage.svg" alt="new page icon" className="float-right" /></a>
                        }
                    }
                    return null;
                });
                content = (
                    <div className="list-group w-100 pr-3">
                        {documents}
                    </div>
                );
            } else {
                content = (
                    <div className="row panel ml-4">
                        <div className="card">
                            <img src="/stewart-small.jpg" alt="Stewart Wilkie" style={{width:100 + '%'}} />
                            <h1>Dr Stewart Wilkie</h1>
                            <p className="title">General Practitioner</p>
                            <p>Stewarton Medical Practice</p>
                            <a href="/about">&nbsp;</a>
                        </div>
                    </div>
                );
            }
            return (
                <div className="wrapper">
                    <FolderSection updateParentFolderName={this.updateFolderName} />
                    {content}
                </div>
        );
    }
  }
}

export default Documents;
