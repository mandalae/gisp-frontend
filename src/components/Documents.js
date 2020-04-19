import React from "react";
import { Redirect } from "react-router-dom";

import FolderSection from "./FolderSection";
import FolderService from "../services/FolderService";
import sessionUtils from "../lib/session";
import analytics from "../lib/analytics";
import { DocumentsList } from "./DocumentsList";
import { Welcome } from "./Welcome";
import { LatestDocuments } from "./LatestDocuments";

class Documents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [],
      folder: null,
      previousFolderName: "",
    };

    this.updateFolderName = this.updateFolderName.bind(this);
    this.fetchDocuments = this.fetchDocuments.bind(this);
  }

  componentDidMount() {
    this.updateFolderName("");
  }

  updateFolderName(newFolder) {
    this.setState({
      folder: newFolder,
      documents: [],
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
    if (!sessionUtils.isLoggedIn()) {
      return <Redirect to="/" />;
    }

    const hasDocuments = this.state.documents.length > 0;

    return (
      <div className="wrapper">
        <FolderSection updateParentFolderName={this.updateFolderName} />
        {hasDocuments ? (
          <DocumentsList
            documents={this.state.documents}
            folder={this.state.folder}
            previousFolderName={this.state.previousFolderName}
            onDocumentClick={this.downloadDocument}
          />
        ) : (
          <div className="welcome-container">
            <Welcome />
            <LatestDocuments onDocumentClick={this.downloadDocument} />
          </div>
        )}
      </div>
    );
  }
}

export default Documents;
