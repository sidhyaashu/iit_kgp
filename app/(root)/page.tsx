import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

const sortFilesByCreationDate = (documents) => {
  return documents
    .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
    .slice(0, 3);
};

const Dashboard = async () => {
  // Fetch data concurrently
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);
  
  // Sort files by creation date
  const sortedFiles = sortFilesByCreationDate(files.documents);

  return (
    <div className="dashboard-container">
      {/* Dashboard Summary Section */}
      <section>
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime date={summary.latestDate} className="text-center" />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Dashboard Recent Files Section */}
      <section className="dashboard-recent-files">
        <Chart used={totalSpace.used} />
        <h2 className="h4 xl:h2 text-light-100">Recent files uploaded</h2>

        {sortedFiles.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {sortedFiles.map((file: Models.Document) => (
              <div
                key={file.$id}
                className="flex items-center gap-3"
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />
                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime date={file.$createdAt} className="caption" />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
