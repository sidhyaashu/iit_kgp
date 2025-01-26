"use client"; // Ensures this is a client-side component

import { getFiles } from "@/lib/actions/file.actions";
import React, { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Loader } from "@/components/Loader";
import ActionDropdown from "@/components/ActionDropdown";
import Image from "next/image";
import { getFileIcon } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Define the types for the parameters
interface Params {
  type: string;
  id: string;
}

const ViewFiles = ({ params }: { params: Params }) => {
  const nvigate = useRouter()
  const { type, id } = React.use(params); // Directly destructure the params

  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch files asynchronously
  const getFileFunc = async () => {
    setLoading(true);
    setError(null);
    try {
      const { documents } = await getFiles({ types: type });
      setFiles(documents);
      setCurrentPdf(documents[0]?.url)
    } catch (error) {
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFileFunc(); // Call the async function when the component mounts
  }, [type]);

  // Handle loading and error states
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-black text-2xl font-bold m-4 capitalize">
                List Of {type === "presentation"?"Pptx":type}
              </SidebarGroupLabel>
              <div onClick={()=>nvigate.replace("/")} className="inline-flex items-center gap-2 py-4 px-3 hover:bg-slate-400 bg-blue-500 text-black mb-2 font-semibold rounded-lg  cursor-pointer">
                <span>🏠</span> {/* Add an icon or text */}
                <span>Home</span>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {files.map((file) => (
                    <SidebarMenuItem
                      key={file.name}
                      
                    >
                      <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-400 rounded-lg transition-all duration-300 ease-in-out"
                        onClick={() => setCurrentPdf(file.url)}
                      >
                              <Image
                                src={getFileIcon(file?.extension, file?.type)}
                                alt="thumbnail"
                                width={20}
                                height={20}
                              />
                            <p className="recent-file-name">{file.name}</p>
                          <ActionDropdown file={file} />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="p-3 w-full">
          <SidebarTrigger />
          <div className="p-3">
            {currentPdf && type === "pdf" && (
              <embed
                src={currentPdf}
                width="100%"
                height="700px"
                className="rounded-lg"
              />
            )}

{currentPdf && (type === "word" || type === "presentation")&& (
              <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(currentPdf)}`}
              width="100%"
              height="700px"
              className="rounded-lg"
              frameBorder="0"
            />
            )}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default ViewFiles;
