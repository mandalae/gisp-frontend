import React from "react";
import { Redirect } from "react-router-dom";

import FolderSection from "./FolderSection";
import FolderService from "../services/FolderService";
import sessionUtils from "../lib/session";
import analytics from "../lib/session";
import { DocumentsList } from "./DocumentsList";
import { Welcome } from "./Welcome";

class Documents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documents: [],
      folder: null,
      previousFolderName: "",
      onlineResources: [],
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
    analytics.recordEvent(`Loaded folder: ${folder.folderName}`);

    FolderService.fetchDocuments(folder.folderKey).then((documents) => {
      this.setState({
        previousFolderName: sessionStorage.getItem("covid.previousFolder"),
        documents: documents,
      });
    });
  }

  downloadDocument(event, itemName) {
    event.preventDefault();

    fetch(
      "https://api.gisp.org.uk/getdocument?document=" +
        encodeURIComponent(itemName),
      {
        headers: {
          "X-Authorization": sessionUtils.getJWTToken(),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    if (!sessionUtils.isLoggedIn()) {
      return <Redirect to="/" />;
    } else {
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
            <Welcome />
          )}
        </div>
      );
    }
  }
}

export default Documents;
