import React, { useEffect, useRef, useState } from 'react';
import { Send, Smile, Info } from 'lucide-react';
import { socket } from '@/socket';
import EmojiPicker from 'emoji-picker-react';
import type { IGetAllChatsResponse, IGetChatMessages } from '@/types/response.types';
import { useAppSelector } from '@/app/hooks/redux-custom-hook';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';

interface ChatViewProps {
  selectedContact: IGetAllChatsResponse | null;
  messages: IGetChatMessages[];
  setMessages: React.Dispatch<React.SetStateAction<IGetChatMessages[]>>;
  setChats: React.Dispatch<React.SetStateAction<IGetAllChatsResponse[]>>;
}

const ChatView: React.FC<ChatViewProps> = ({
  selectedContact,
  messages,
  setMessages,
  setChats,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const accountId = useAppSelector((state) => state.authReducer.accountId);

  useEffect(() => {
    const el = messageContainerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    const handleReceive = (message: any) => {
      if (
        selectedContact &&
        (message.senderId === selectedContact.chatPartner.id ||
          message.receiverId === selectedContact.chatPartner.id)
      ) {
        setMessages((prev) => [...prev, message]);
        setChats((prev) =>
          prev.map((chat) =>
            chat.chatPartner.id === message.senderId
              ? { ...chat, lastMessage: { content: message.message, timestamp: message.timestamp } }
              : chat
          )
        );
      }
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [selectedContact]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    socket.emit(
      'send_message',
      {
        message: inputText,
        receiverId: selectedContact?.chatPartner.id,
      },
      (response: { success: boolean; message?: any }) => {
        if (!response.success) {
          
        
          toast.error('Message failed',toastifyOptionsCenter);
        }
      }
    );
    setChats((prev) => {
      const exist = prev.find((chat) => chat.chatPartner.id === selectedContact?.chatPartner.id);

      if (!exist) {
        return [
          ...prev,
          {
            chatPartner: selectedContact?.chatPartner!,
            lastMessage: { content: inputText, timestamp: new Date() },
            unreadCount: 0,
          },
        ];
      }

      return prev.map((chat) =>
        chat.chatPartner.id === selectedContact?.chatPartner.id
          ? {
              ...chat,
              lastMessage: { content: inputText, timestamp: new Date() },
            }
          : chat
      );
    });

    setInputText('');
  };

  if (!selectedContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Info size={40} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Select a conversation</h3>
        <p className="text-gray-500 mt-2">Choose a chat from the left to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white border-l border-gray-200 ">
      {/* Header */}
      <div className="h-16 flex-none border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <img
            src={selectedContact.chatPartner.profilePicture || '/defaultProfile.jpg'}
            alt={selectedContact.chatPartner.name}
            className="w-10 h-10 rounded-full object-cover shadow-sm"
          />
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {selectedContact.chatPartner.name}
            </h2>
            {/* <p className="text-xs text-green-500 font-medium">
              {selectedContact.online ? 'Online' : 'Offline'}
            </p> */}
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4" ref={messageContainerRef}>
        {messages.map((msg) => {
          const isMe = msg.senderId === accountId;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl flex items-end gap-2 ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
              <span className={`text-[11px] text-gray-400 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                {new Date(msg.timestamp).toLocaleString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <Paperclip size={20} />
          </button> */}
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div
              className={`absolute bottom-28 left-1/3 z-20 ${showEmojiPicker ? 'block' : 'hidden'}`}
            >
              <EmojiPicker
                height={300}
                width={600}
                searchDisabled
                onEmojiClick={(emoji) => setInputText((prev) => prev + emoji.emoji)}
              />
            </div>
            <button
              type="button"
              className={`text-gray-400 hover:text-yellow-500 transition-colors mr-2 cursor-pointer ${showEmojiPicker ? 'text-yellow-500' : ''}`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/30 flex items-center justify-center"
          >
            <Send size={18} className="translate-x-[1px]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
