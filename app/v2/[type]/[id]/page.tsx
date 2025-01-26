"use client";

import { getFiles } from "@/lib/actions/file.actions";
import React, { useEffect, useState ,useRef} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SmartToy,Close } from '@mui/icons-material';

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

// Define the types for the parameters
interface Params {
  type: string;
  id: string;
}

interface Message {
  sender: "user" | "assistant";
  text: string;
}

const ViewFiles = ({ params }: { params: Params }) => {
  const navigate = useRouter();
  const { type, id } = React.use(params);

  const [currentPdf, setCurrentPdf] = useState<string | null>(null);
  const [currentBucketFieldId,setCurrentBucketFieldId] = useState<string | null>(null)
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState<boolean>(false);

  // Function to get the list of files from the server
  const getFileFunc = async () => {
    setLoading(true);
    setError(null);
    try {
      const { documents } = await getFiles({ types: type });
      setFiles(documents);
      setCurrentPdf(documents[0]?.url);
      setCurrentBucketFieldId(documents[0]?.bucketFileId)
    } catch (error) {
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  // Function to send the file URL to the backend and get the parsed data
  // const getFileData = async (bucketFileId: string) => {
  //   setGenLoading(true);
  //   try {
  //     // Send the constructed download URL to the API route to process the file
  //     const response = await axios.post("/api/files", { currentBucketFieldId: bucketFileId });
  
  //     // Set the raw data (parsed text) from the backend response
  //     setRawData(response.data.text);
  //     setGenLoading(false);
  //   } catch (error) {
  //     setGenLoading(false);
  //     console.log(error);
  //   }
  // };


  // Fetch files when the component is mounted or the `type` changes
  useEffect(() => {
    getFileFunc();
  }, [type]);


  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    // Add the user's message to the chat history
    const newMessages: Message[] = [
      ...messages,
      { sender: "user", text: userInput },
    ];

    setMessages(newMessages);
    setUserInput("");

    // Simulate the assistant's response (you could replace this with an actual API call)
    setTimeout(() => {
      const assistantResponse: Message = {
        sender: "assistant",
        text: "I am here to help! Can you please elaborate on your question?",
      };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
    }, 1000);
  };

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle loading and error states
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-black text-2xl font-bold m-4 capitalize">
                List Of {type === "presentation" ? "Pptx" : type}
              </SidebarGroupLabel>
              <div
                onClick={() => navigate.replace("/")}
                className="inline-flex items-center gap-2 py-4 px-3 hover:bg-slate-400 bg-blue-500 text-black mb-2 font-semibold rounded-lg cursor-pointer"
              >
                <span>🏠</span>
                <span>Home</span>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {files.map((file) => (
                    <SidebarMenuItem key={file.name}>
                      <div
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out
                        ${currentPdf === file.url ? "shad-active" : "bg-slate-300"} 
                        hover:shad-active`}
                        onClick={() => {setCurrentPdf(file.url),setCurrentBucketFieldId(file.bucketFileId)}}
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

            {currentPdf && (type === "word" || type === "presentation") && (
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

      <div>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="absolute bottom-10 right-10 p-4 bg-purple-600 rounded-full shadow-lg text-white z-50"
      >
        {
          isChatOpen ? <Close/> : <SmartToy />
        }
        
        
      </button>

      {/* Chat Interface */}
      {isChatOpen && (
        <div
          className="fixed bottom-20 right-20 w-96 h-96 sm:w-[80vw] sm:h-[80vh] md:w-[50vw] md:h-[70vh] bg-white rounded-xl shadow-lg p-5 flex flex-col overflow-hidden"
          style={{ zIndex: 999 }}
        >
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 "
            style={{
              /* Hide scrollbars but still allow scrolling */
              scrollbarWidth: "none", /* Firefox */
              msOverflowStyle: "none", /* IE and Edge */
            }}
          >
            {/* Display Chat Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    message.sender === "assistant"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-500 text-black"
                  }`}
                >
                  <strong>
                    {message.sender === "assistant" ? "Assistant" : "You"}:
                  </strong>{" "}
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Field and Send Button */}
          <div className="flex items-center space-x-3 mt-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-600 text-black bg-slate-400 hover:bg-slate-500 rounded-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ViewFiles;
