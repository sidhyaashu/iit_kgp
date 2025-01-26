import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";

const ListCard = ({ files }: { files: Models.Document[] }) => {
  return (
    <div className="card-list-view-page">
      {files.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-5">
          {files
            // Sort files based on created date
            .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
            // Slice the array to get only the latest 3
            .slice(0, 3)
            .map((file) => (
              <Link
                key={file.$id}
                href={`/pdf/${file.$id}`} // Dynamically link to the PDF viewer page
                className="flex items-center gap-3"
              >
                <Thumbnail type={file.type} extension={file.extension} url={file.url} />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime date={file.$createdAt} className="caption" />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
        </ul>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default ListCard;
