import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconSettings from "../../../components/Icon/IconSettings";
import IconSearch from "../../../components/Icon/IconSearch";
import IconMenu from "../../../components/Icon/IconMenu";
import IconCopy from "../../../components/Icon/IconCopy";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconMoodSmile from "../../../components/Icon/IconMoodSmile";
import IconSend from "../../../components/Icon/IconSend";
import IconDownload from "../../../components/Icon/IconDownload";
import Dropdown from "../../../components/Dropdown";
import IconHorizontalDots from "../../../components/Icon/IconHorizontalDots";

const loginUser = {
  id: 0,
  name: "Alon Smith",
  path: "profile-34.jpeg",
  designation: "Software Developer",
};

const Chat = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Chat"));
  });
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const isDark = useSelector(
    (state) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );

  const [isShowChatMenu, setIsShowChatMenu] = useState(false);
  // const [searchUser, setSearchUser] = useState("");
  // const [isShowUserChat, setIsShowUserChat] = useState(false);
  const [clinic, setClinic] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [filteredItems, setFilteredItems] = useState(contactList);

  const sendMessage = () => {
    if (textMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: textMessage,
        sender: loginUser.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setTextMessage('');
      scrollToBottom();
    }
  };
  const sendMessageHandle = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <div>
      <div
        className={`flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full sm:min-h-0 ${
          isShowChatMenu ? "min-h-[999px]" : ""
        }`}
      >
        {/* <div
          className={`bg-black/60 z-[5] w-full h-full absolute rounded-md hidden ${
            isShowChatMenu ? "!block xl:!hidden" : ""
          }`}
          onClick={() => setIsShowChatMenu(!isShowChatMenu)}
        ></div> */}
        <div className="panel p-0 flex-1">
            <div className="relative h-full">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    type="button"
                    className="xl:hidden hover:text-primary"
                    onClick={() => setIsShowChatMenu(!isShowChatMenu)}
                  >
                    <IconMenu />
                  </button>
                  <div className="relative flex-none">
                    <img
                      src={`/assets/images/profile-1.jpeg`}
                      className="rounded-full w-10 h-10 sm:h-12 sm:w-12 object-cover"
                      alt=""
                    />
                    <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                      <div className="w-4 h-4 bg-success rounded-full"></div>
                    </div>
                  </div>
                  <div className="mx-3">
                    <p className="font-semibold">Admin</p>
                    <p className="text-white-dark text-xs">
                      {/* {clinic.active
                        ? "Active now"
                        : "Last seen at " + clinic.time} */}
                        Active
                    </p>
                  </div>
                </div>
                
                <div className="flex sm:gap-5 gap-3">
                  
                  <div className="dropdown">

                  </div>
                </div>
              </div>
              <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

              <PerfectScrollbar className="relative h-full sm:h-[calc(100vh_-_300px)] chat-conversation-box">
                <div className="space-y-5 p-4 sm:pb-0 pb-[68px] sm:min-h-[300px] min-h-[400px]">
                  <div className="block m-6 mt-0">
                    <h4 className="text-xs text-center border-b border-[#f4f4f4] dark:border-gray-800 relative">
                      <span className="relative top-2 px-3 bg-white dark:bg-black">
                      {"Today, " + "2:30"}
                      </span>
                    </h4>
                  </div>

                  
                  
                </div>
              </PerfectScrollbar>
              <div className="p-4 absolute bottom-0 left-0 w-full">
                <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center">
                  <div className="relative flex-1">
                    <input
                      className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 focus:outline-none py-2"
                      placeholder="Type a message"
                      value={textMessage}
                      onChange={(e) => setTextMessage(e.target.value)}
                      onKeyUp={sendMessageHandle}
                    />
                    
                    <button
                      type="button"
                      className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 hover:text-primary"
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
