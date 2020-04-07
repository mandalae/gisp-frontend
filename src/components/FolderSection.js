import React from 'react';
import  { Redirect } from 'react-router-dom';

import FolderService from '../services/FolderService';
import sessionUtils from '../lib/session';

class FolderSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {folders: [], subFolders: [], folder: '', previousFolder: null};

    this.fetchFolders = this.fetchFolders.bind(this);
    this.updateParentFolderName = props.updateParentFolderName;
  }

    componentDidMount() {
        this.fetchFolders();
    }

    fetchFolders(folder, subFolder) {
        if (!folder) {
            folder = {
                folderName: '',
                folderKey: ''
            }
        } else {
            folder.folderName = folder.folderName.replace('/', '');
        }

        if (!this.state.subFolders[folder.folderKey]){
            FolderService.fetchFolders(folder.folderKey).then(folders => {
                let stateObject = {
                    folder: folder
                };
                if (folder.folderName === ''){
                    stateObject.folders = folders;
                } else if (folders.length > 0){
                    stateObject.previousFolder = folder;
                    stateObject.subFolders = [];
                    stateObject.subFolders[folder.folderKey] = folders;
                } else if (!subFolder) {
                    this.setState({
                        subFolders: []
                    });
                }

                this.setState(stateObject);
                sessionStorage.setItem('covid.currentFolder', folder.folderName);
                sessionStorage.setItem('covid.previousFolder', this.state.previousFolder ? this.state.previousFolder.folderName : '');

                this.updateParentFolderName(folder);
            }).catch(e => {
                console.log(e);
                sessionUtils.removeSession();
                window.location = '/';
            });
        } else {
            this.setState({
                subFolders: []
            });
        }
    }

  render() {
      if (!sessionUtils.isLoggedIn()){
            return <Redirect to='/' />
      } else {
        let items = this.state.folders.map((item, key) => {
            if (item.folderName){
                if (!this.state.subFolders[item.folderKey]){
                    return <li className="nav-item" key={item.folderKey}><a className={"nav-link btn btn-sm ml-2 mb-1 text-left" + (this.state.folder.folderKey === item.folderKey ? ' btn-info' : ' btn-outline-info')} href="/documents" onClick={(e) => { e.preventDefault(); this.fetchFolders(item); }}>{item.folderName.replace('/', '')}</a></li>
                } else {
                    const subFolders = this.state.subFolders[item.folderKey].map((subItem, subKey) => {
                        return <li className="nav-item subfolder" key={"sub-" + subItem.folderKey}><a className={"nav-link btn btn-sm ml-3 mb-1 text-left" + (this.state.folder.folderKey === subItem.folderKey ? ' btn-secondary' : ' btn-outline-secondary')} href="/documents" onClick={(e) => { e.preventDefault(); this.fetchFolders(subItem, true); }}>{subItem.folderName.replace('/', '')}</a></li>
                    });
                    return (
                        <div>
                            <li className="nav-item" key={item.folderKey}><a className={"nav-link btn btn-sm ml-2 mb-1 text-left" + (this.state.folder.folderKey === item.folderKey ? ' btn-info' : ' btn-outline-info')} href="/documents" onClick={(e) => { e.preventDefault(); this.fetchFolders(item); }}>{item.folderName.replace('/', '')}</a></li>
                            {subFolders}
                        </div>
                    );
                }
            }
            return null;
        });
        return (
            <ul className="sidebar">
                {items}
            </ul>
        );
    }
  }
}

export default FolderSection;
