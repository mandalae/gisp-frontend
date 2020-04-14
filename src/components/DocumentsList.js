import React from "react";
import { ListItem } from "./DocumentListItem";

export const DocumentsList = ({
  documents,
  folder,
  previousFolderName,
  onDocumentClick,
}) => {
  const documentsToRender = []
    .concat(documents)
    .sort((a, b) => {
      const aDate = new Date(a.LastModified || a.lastUpdated);
      const bDate = new Date(b.LastModified || b.lastUpdated);
      return bDate.getTime() - aDate.getTime();
    })
    .map((item) => {
      if (folder && folder.folderName !== "") {
        if (item.Key && item.Key.indexOf("/") !== item.Key.length - 1) {
          const documentName = item.Key.replace(
            folder.folderName.replace("_", " ") + "/",
            ""
          ).replace(previousFolderName + "/", "");

          return (
            <ListItem
              key={item.ETag}
              date={item.LastModified}
              iconSrc={"/icons/download.svg"}
              iconAltText="Download document"
              folderName={folder.folderName}
              resourceName={documentName}
            >
              <a
                href="/documents"
                onClick={(e) => onDocumentClick(e, item.Key)}
                style={{ color: "inherit" }}
              >
                {documentName}
              </a>
            </ListItem>
          );
        } else if (item.url) {
          const linkName = item.title;
          return (
            <ListItem
              key={item.url}
              date={item.lastUpdated}
              iconSrc={"/icons/link.svg"}
              iconAltText="Open in a new page"
              folderName={folder.folderName}
              resourceName={linkName}
            >
              <a
                title="This link will open in a new page"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkName}
              </a>
            </ListItem>
          );
        }
      }
      return null;
    });

  return <div className="list-group w-100 pr-3">{documentsToRender}</div>;
};
