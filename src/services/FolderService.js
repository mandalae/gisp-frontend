export const FolderService = (props) => {

    const fetchFolders = (folderName) => {
        if (!folderName){
            folderName = '';
        }
        if (folderName.substring(folderName.length, folderName.length-1) === '/'){
            folderName = folderName.substring(0, folderName.length-1);
        }
        return new Promise((resolve, reject) => {
            fetch("https://3rscxpdnjh.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-getFolders?folderName=" + folderName + "&hash=" + sessionStorage.getItem('covid.loggedin'))
              .then(res => res.json())
              .then(
                result => {
                    const onlyFolders = result.filter(item => {
                        if (item.folderName && item.folderName.indexOf('/') === item.folderName.length -1){
                            return true;
                        } else if (item.url && item.title) {
                            return true;
                        }
                        return false;
                    });
                    resolve(onlyFolders);
                },
                error => {
                  reject(error);
                }
              )
        });
    }

    const fetchDocuments = (folderName) => {
        if (!folderName){
            folderName = '';
        }
        if (folderName.substring(folderName.length, folderName.length-1) === '/'){
            folderName = folderName.substring(0, folderName.length-1);
        }
        return new Promise((resolve, reject) => {
            fetch("https://3rscxpdnjh.execute-api.eu-west-1.amazonaws.com/default/GPCovidResponse-Documents?folderName=" + folderName + "&hash=" + sessionStorage.getItem('covid.loggedin'))
              .then(res => res.json())
              .then(
                result => {
                    const onlyDocuments = result.filter(item => {
                        return ((item.Key && item.Key.replace(folderName + '/', '').indexOf('/') !== item.Key.replace(folderName + '/', '').length - 1) || (item.url && item.title));
                    });
                    resolve(onlyDocuments);
                },
                error => {
                  reject(error);
                }
              )
        });
    }

    return {
        fetchFolders: fetchFolders,
        fetchDocuments: fetchDocuments
    }
}

export default FolderService();
