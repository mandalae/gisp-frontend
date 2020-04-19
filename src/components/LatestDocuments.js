import React, { useState, useEffect, memo } from "react";
import FolderService from "../services/FolderService";
import { ListItem } from "./DocumentListItem";

export const LatestDocuments = memo(({ onDocumentClick }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    FolderService.fetchLatestDocuments()
      .then((documents) => {
        if (!isCancelled) {
          setDocuments(documents);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.log("Unable to fetch latest documents", err);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!documents.length) {
    return null;
  }

  return (
    <div>
      <h6>Latest uploaded resources</h6>
      <div className="list-group w-100 pr-3">
        {documents.map((item) => {
          if (item.Key) {
            const documentNameParts = item.Key.split("/");
            const documentName =
              documentNameParts[documentNameParts.length - 1];
            const folderName = documentNameParts
              .slice(0, documentNameParts.length - 1)
              .join("/");

            return (
              <ListItem
                key={item.ETag}
                date={item.LastModified}
                iconSrc={"/icons/download.svg"}
                iconAltText="Download document"
                folderName={folderName}
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
            const folderName = item.folder;
            return (
              <ListItem
                key={item.url}
                date={item.lastUpdated}
                iconSrc={"/icons/link.svg"}
                iconAltText="Open in a new page"
                folderName={folderName}
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
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
});
