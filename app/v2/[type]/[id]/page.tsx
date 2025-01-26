"use client";

import { getFiles } from "@/lib/actions/file.actions";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SmartToy, Close } from "@mui/icons-material";
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
import { aiModel } from "@/configs/aiModel";

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
  const [currentBucketFieldId, setCurrentBucketFieldId] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [genLoading,setGenLoading] = useState(false)

  const getFileFunc = async () => {
    setLoading(true);
    setError(null);
    try {
      const { documents } = await getFiles({ types: type });
      setFiles(documents);
      setCurrentPdf(documents[0]?.url);
      setCurrentBucketFieldId(documents[0]?.bucketFileId);
    } catch {
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFileFunc();
  }, [type]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages: Message[] = [
      ...messages,
      { sender: "user", text: userInput },
    ];

    setMessages(newMessages);
    setUserInput("");

    try {
      setGenLoading(true);
      const loadingMessage: Message = { sender: "assistant", text: "Typing..." };
      setMessages((prevMessages) => [...prevMessages, loadingMessage]);

      const result = await aiModel.sendMessage(userInput);
      const assistantResponse: Message = {
        sender: "assistant",
        text: result.response.text(),
      };

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat(assistantResponse)
      );
      setGenLoading(false);
    } catch (error) {
      console.error("Error sending message to AI model:", error);
      setGenLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
                        onClick={() => { setCurrentPdf(file.url), setCurrentBucketFieldId(file.bucketFileId) }}
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
        <button
          onClick={toggleChat}
          className="absolute bottom-10 right-10 p-4 bg-purple-600 rounded-full shadow-lg text-white z-50"
        >
          {isChatOpen ? <Close /> : <SmartToy />}
        </button>

        {isChatOpen && (
          <div
            className="fixed bottom-20 right-20 w-96 h-96 sm:w-[80vw] sm:h-[80vh] md:w-[50vw] md:h-[70vh] bg-white rounded-xl shadow-lg p-5 flex flex-col overflow-hidden"
            style={{ zIndex: 999 }}
          >
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "assistant" ? "justify-start" : "justify-end"
                    }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${message.sender === "assistant"
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
