import React from 'react';
import  { Redirect } from 'react-router-dom';

import FolderSection from './FolderSection';
import FolderService from '../services/FolderService';

import sessionUtils from '../lib/session';
import analytics from '../lib/analytics';

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
      analytics.recordEvent('loaded_folder', {
          folder: folder.folderName
      });

      FolderService.fetchDocuments(folder.folderKey).then(documents => {
          this.setState({
              previousFolderName: sessionStorage.getItem('covid.previousFolder'),
              documents: documents
          });
      });
  }

  downloadDocument(event, itemName) {
      event.preventDefault();

      analytics.recordEvent('document_download', {
          document: itemName
      });

      fetch("https://api.gisp.org.uk/getdocument?document=" + encodeURIComponent(itemName), {
          headers: {
              'X-Authorization': sessionUtils.getJWTToken()
          }
      })
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
      if (!sessionUtils.isLoggedIn()){
            return <Redirect to='/' />
      } else {
          let content = (
              <div>
                <h5>Welcome to GISP</h5>
                <p>If you haven't yet signed up to the GISP Facebook feedback group, we would recommend you do so.</p>
                <p>This is where we are currently publishing updates and news about the site, as well as collecting feedback for improvements.</p>
                <p><a href="https://www.facebook.com/groups/2663605157100534/?ref=share"><i className="fa fa-facebook-f"></i> GP Information Sharing Portal (Facebook)</a></p>
              </div>
          );

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
