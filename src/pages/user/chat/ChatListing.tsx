import { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatView from './components/ChatView';
import { useSearchParams } from 'react-router-dom';
import { getAllChats, getChatMessages } from '@/api/user/user.chat';
import type { IGetAllChatsResponse, IGetChatMessages } from '@/types/response.types';
import LoadingSpin from '@/components/common/LoadingSpin';
import { socket } from '@/socket';

const ChatListing = () => {
  const [loadingChats, setLoadingChats] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<IGetChatMessages[]>([]);
  const [chats, setChats] = useState<IGetAllChatsResponse[]>([]);
  const [selectedContact, setSelectedContact] = useState<IGetAllChatsResponse | null>(null);
  const currentRoomRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getAllChats();
        setChats(chats);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    socket.on('new_chat', (data) => {
      setChats((prevChats) => {
        const exist = prevChats.find((chat) => chat.chatPartner.id === data.chatPartner.id);

        const isActive = selectedContact?.chatPartner.id === data.chatPartner.id;

        if (exist) {
          return prevChats
            .map((chat) =>
              chat.chatPartner.id === data.chatPartner.id
                ? {
                    ...chat,
                    unreadCount: isActive ? 0 : chat.unreadCount + 1,
                    lastMessage: {
                      content: data.lastMessage.content,
                      timestamp: data.lastMessage.timestamp,
                    },
                  }
                : chat
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessage.timestamp).getTime() -
                new Date(a.lastMessage.timestamp).getTime()
            );
        }

        return [...prevChats, data].sort(
          (a, b) =>
            new Date(b.lastMessage.timestamp).getTime() -
            new Date(a.lastMessage.timestamp).getTime()
        );
      });
    });

    return () => {
      socket.off('new_chat');
    };
  }, [selectedContact]);

  useEffect(() => {
    async function fetchMessages(id: string) {
      try {
        setLoadingChats(true);
        const data = await getChatMessages(id);
        setMessages(data.chats);
        const receiverId = data.chatPartner.id;

        setSelectedContact({
          chatPartner: data.chatPartner,
          unreadCount: 0,
          lastMessage: {
            content: '',
            timestamp: new Date(),
          },
        });
        setLoadingChats(false);
        socket.emit('mark_message_read', { senderId: receiverId });
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatPartner.id === receiverId ? { ...chat, unreadCount: 0 } : chat
          )
        );
      } catch (error) {
        setLoadingChats(false);
        console.log(error);
      }
    }

    if (searchParams.get('contactId')) {
      fetchMessages(searchParams.get('contactId')!);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedContact) {
      setSearchParams({
        contactId: selectedContact.chatPartner.id,
      });
    }
  }, [selectedContact]);

  

  useEffect(() => {
    if (!selectedContact) return;

    const receiverId = selectedContact.chatPartner.id;

    // Leave previous room
    if (currentRoomRef.current) {
      socket.emit('leave_chat', currentRoomRef.current);
    }

    // Join new room
    socket.emit('join_chat', receiverId);
    currentRoomRef.current = receiverId;
  }, [selectedContact]);

  return (
    <div className="pt-24 pb-10">
      <div className="flex h-[calc(100vh-9rem)]  bg-white overflow-hidden max-w-7xl mx-auto rounded-xl shadow-sm border border-gray-200 mt-4 mr-4 ml-4 xl:ml-auto xl:mr-auto">
        {/* Sidebar List */}
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col h-full bg-white shrink-0 ${selectedContact ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <MessageSquare className="text-blue-600" /> Messages
              </h1>
              {/* <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                <Plus size={20} />
              </button> */}
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {chats.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {chats.map((contact) => (
                  <li key={contact.chatPartner.id}>
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 relative group ${selectedContact?.chatPartner.id === contact.chatPartner.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                    >
                      {/* Selection Indicator line */}
                      {selectedContact?.chatPartner.id === contact.chatPartner.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                      )}

                      <div className="relative shrink-0">
                        <img
                          src={contact.chatPartner.profilePicture || '/defaultProfile.jpg'}
                          alt={contact.chatPartner.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {/* {contact.chatPartner.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )} */}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3
                            className={`text-sm font-semibold truncate ${selectedContact?.chatPartner.id === contact.chatPartner.id ? 'text-blue-900' : 'text-gray-900'}`}
                          >
                            {contact.chatPartner.name}
                          </h3>
                          {/* <span
                            className={`text-xs whitespace-nowrap ${contact.unread > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                          >
                            {contact.time}
                          </span> */}
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p
                            className={`text-xs truncate ${contact.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                          >
                            {contact.lastMessage.content}
                          </p>
                          {contact.unreadCount > 0 && (
                            <span className="shrink-0 bg-blue-600 text-white min-w-[1.25rem] h-5 rounded-full px-1 text-[10px] font-bold flex items-center justify-center">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No conversations found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`flex-1 h-full flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Mobile back button header - only visible on small screens when a chat is selected */}
          {selectedContact && (
            <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200">
              <button
                onClick={() => setSelectedContact(null)}
                className="text-blue-600 font-medium text-sm flex items-center gap-1"
              >
                &larr; Back to chats
              </button>
            </div>
          )}
          {!loadingChats ? (
            <ChatView
              selectedContact={selectedContact}
              messages={messages}
              setMessages={setMessages}
              setChats={setChats}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <LoadingSpin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListing;
