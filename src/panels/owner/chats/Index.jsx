import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconSend from "../../../components/Icon/IconSend";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconLoader from "../../../components/Icon/IconLoader";
import { showMessage } from "../../../utils/showMessage";
import IconX from "../../../components/Icon/IconX";

const Chat = () => {
  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const ownerId = userData?.UserOwner?.[0]?.owner_id || 0;
  const ownerRoleId = userData?.role_id || 0;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Chat"));
  }, []);

  const [textMessage, setTextMessage] = useState({
    owner_id: ownerId,
    content: "",
    parent_message_id: "",
  });
  const [messageLoading, setMessageLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      const element = document.querySelector(".chat-conversation-box");
      element.behavior = "smooth";
      element.scrollTop = element.scrollHeight;
    });
  };

  // fetch messages function
  const fetchMessages = async () => {
    setMessageLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/message/getmessage/${ownerId}`
      );
      setMessages(response?.data?.Messages?.rows);
      setMessageLoading(false);
      scrollToBottom();
    } catch (error) {
      console.log(error);
      setMessageLoading(false);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplyClick = (message) => {
    setTextMessage({
      ...textMessage,
      parent_message_id: message?.message_id,
    });
    setReplyMessage(message);
    inputRef.current.focus();
  };

  const handleRemoveReply = () => {
    setTextMessage({
      ...textMessage,
      parent_message_id: "",
    });
    setReplyMessage(null);
  };

  //Send message function
  const sendMessage = async () => {
    if (!textMessage?.content) {
      return true;
    }

    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/message/sendmessage",
        textMessage
      );
      if (response.status === 201) {
        showMessage("Message sended successfully.");
        handleRemoveReply();
        setTextMessage({ ...textMessage, content: "", parent_message_id: "" });
        fetchMessages();
      } else {
        showMessage("Failed to add support user. Please try again.", "error");
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    }
  };

  const sendMessageHandle = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // Function to find the message content by parent_message_id
  const getParentMessageContent = (parentId) => {
    const parentMessage = messages.find((msg) => msg.message_id === parentId);
    return parentMessage ? parentMessage.content : "Message not found";
  };

  return (
    <div>
      <div
        className={`flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full sm:min-h-0`}
      >
        <div className="panel p-0 flex-1">
          <div className="relative h-full">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="relative flex-none">
                  <img
                    src={`/assets/images/empty-user.png`}
                    className="rounded-full w-10 h-10 sm:h-12 sm:w-12 object-cover"
                    alt=""
                  />
                </div>
                <div className="mx-3">
                  <p className="font-semibold capitalize">Super Admin</p>
                </div>
              </div>
            </div>
            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
            {messageLoading ? (
              <div className="h-auto sm:h-20 w-full grid place-items-center">
                <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
              </div>
            ) : (
              <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_300px)] chat-conversation-box">
                <div className="space-y-5 p-4 sm:pb-0 pb-[68px] sm:min-h-[300px] min-h-[400px]">
                  {messages && messages?.length ? (
                    <>
                      {messages?.map((message) => {
                        return (
                          <div key={message?.message_id}>
                            <div
                              className={`flex items-start gap-3 ${
                                ownerRoleId == message?.sender_role_id
                                  ? "justify-end"
                                  : ""
                              }`}
                            >
                              <div
                                className={`flex-none ${
                                  ownerRoleId == message?.sender_role_id
                                    ? "order-2"
                                    : ""
                                }`}
                              ></div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 relative">
                                  <div
                                    className={`dark:bg-gray-800 px-3 py-2 rounded-md max-w-[550px] bg-black/10 ${
                                      ownerRoleId == message?.sender_role_id
                                        ? "ltr:rounded-br-none rtl:rounded-bl-none !bg-primary text-white"
                                        : "ltr:rounded-bl-none rtl:rounded-br-none"
                                    }`}
                                  >
                                    {message?.parent_message_id && (
                                      <div
                                        className={`${
                                          ownerRoleId == message?.sender_role_id
                                            ? "bg-[#4a4d8582] dark:bg-[#292d7582] text-slate-400"
                                            : "bg-[#9898a082] dark:bg-[#17172a82] text-slate-600"
                                        } rounded p-1 w-full`}
                                      >
                                        {getParentMessageContent(
                                          message?.parent_message_id
                                        )}
                                      </div>
                                    )}
                                    {message?.content || ""}
                                  </div>
                                  {ownerRoleId != message?.sender_role_id && (
                                    <div
                                      onClick={() => handleReplyClick(message)}
                                      className="absolute -bottom-4.5 right-0 text-xs text-[#006241] font-semibold text-right cursor-pointer w-fit"
                                    >
                                      Reply
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="grid place-items-center h-[calc(100vh_-_350px)]">
                      No messages
                    </div>
                  )}
                </div>
              </PerfectScrollbar>
            )}
            <div className="p-4 absolute bottom-0 left-0 w-full">
              {replyMessage && (
                <div className="absolute bottom-0 left-0 w-full h-auto pb-16 pt-2 px-5 rounded bg-[#d9daebf0] dark:bg-[#121436f9] flex items-center justify-between gap-2">
                  <div className="bg-gray-100 dark:bg-[#050b14] py-1 px-2 rounded w-full">
                    {replyMessage?.content || ""}
                  </div>
                  <button className="" onClick={handleRemoveReply}>
                    <IconX />
                  </button>
                </div>
              )}
              <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    className="form-input rounded-full border-0 bg-[#f4f4f4] pr-12 pl-6 focus:outline-none py-2"
                    placeholder="Type a message"
                    value={textMessage?.content}
                    onChange={(e) =>
                      setTextMessage({
                        ...textMessage,
                        content: e.target.value,
                      })
                    }
                    onKeyUp={sendMessageHandle}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-[#006241]"
                    onClick={() => sendMessage()}
                  >
                    <IconSend />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
