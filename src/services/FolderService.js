import session from "../lib/session";
import {
  GET_FOLDERS_URL,
  GET_DOCUMENTS_URL,
  GET_LATEST_DOCUMENTS_LIMIT,
} from "./constants";

export const FolderService = (props) => {
  const fetchFolders = (folderName) => {
    if (!folderName) {
      folderName = "";
    }
    if (
      folderName.substring(folderName.length, folderName.length - 1) === "/"
    ) {
      folderName = folderName.substring(0, folderName.length - 1);
    }
    return new Promise((resolve, reject) => {
      fetch(`${GET_FOLDERS_URL}?folderName=` + folderName, {
        headers: {
          "X-Authorization": session.getJWTToken(),
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            const onlyFolders = result.filter((item) => {
              if (
                item.folderName &&
                item.folderName.indexOf("/") === item.folderName.length - 1
              ) {
                return true;
              } else if (item.url && item.title) {
                return true;
              }
              return false;
            });
            resolve(onlyFolders);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  const fetchDocuments = (folderName) => {
    if (!folderName) {
      folderName = "";
    }
    if (
      folderName.substring(folderName.length, folderName.length - 1) === "/"
    ) {
      folderName = folderName.substring(0, folderName.length - 1);
    }
    return new Promise((resolve, reject) => {
      fetch(`${GET_DOCUMENTS_URL}?folderName=` + folderName, {
        headers: {
          "X-Authorization": session.getJWTToken(),
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            const onlyDocuments = result.filter((item) => {
              return (
                (item.Key &&
                  item.Key.replace(folderName + "/", "").indexOf("/") !==
                    item.Key.replace(folderName + "/", "").length - 1) ||
                (item.url && item.title)
              );
            });
            resolve(onlyDocuments);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  const fetchLatestDocuments = () => {
    return fetch(
      `${GET_DOCUMENTS_URL}?latest=true&limit=${GET_LATEST_DOCUMENTS_LIMIT}`,
      {
        headers: {
          "X-Authorization": session.getJWTToken(),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const delimeter = "/";
        const onlyDocuments = res.filter((item) => {
          return (
            (item.Key && item.Key.length - 1 !== delimeter) ||
            (item.url && item.title)
          );
        });
        return onlyDocuments;
      });
  };

  return {
    fetchFolders,
    fetchDocuments,
    fetchLatestDocuments,
  };
};

export default FolderService();
