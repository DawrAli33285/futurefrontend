import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { io } from 'socket.io-client';
import { BASE_URL } from './baseurl';

const Avatar = ({ imageUrl, name, fallbackColor = 'bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400', size = 'w-10 h-10' }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageUrl && !imageError) {
    return (
      <img 
        src={imageUrl} 
        alt={name}
        className={`${size} rounded-full flex-shrink-0 object-cover`}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setImageError(true)}
      />
    );
  }
  
  return (
    <div className={`${fallbackColor} ${size} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
};

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messageAreaRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: '',
    avatar: '',
    color: 'bg-purple-600',
    imageUrl: ''
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      if (newMessage.trim()) {
        let token = localStorage.getItem('token');
        token = JSON.parse(token);
        let response = await axios.post(`${BASE_URL}/sendMessage`, { message: newMessage }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const newMsg = {
          id: response.data.sentMessage._id,
          user: response.data.sentMessage.user.name,
          avatar: response.data.sentMessage.user.name.charAt(0).toUpperCase(),
          timestamp: new Date(response.data.sentMessage.createdAt || Date.now()).toLocaleString('en-US', { 
            weekday: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
          }).toLowerCase(),
          content: response.data.sentMessage.message,
          isCurrentUser: true,
          imageUrl: response.data.sentMessage.user.imageUrl
        };
  
    
        socketRef.current.emit("messageSend", newMsg);
        setNewMessage('');
      }
    } catch (e) {
      console.error('Error sending message:', e);
      toast.error('Failed to send message', { containerId: 'chat' });
    }
  };

  useEffect(() => {
    fetchMessages();
    addSocketEvents();
  }, []);

  const addSocketEvents = async () => {
    try {
      let socket = io(`${BASE_URL}`);

      socketRef.current = socket;
      socketRef.current.on('messageSend', (data) => {
        console.log("received message:", data);
        setMessages((prev) => {
        
          const exists = prev.some(msg => msg.id === data.id);
          if (exists) return prev;
          
          return [...prev, data];
        });
      });
    } catch (e) {
      console.error('Socket connection error:', e);
    }
  };

  useEffect(() => {
    const div = messageAreaRef.current;
    if (!div) return;

    
    div.scrollTo({ top: div.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      let userInfo = localStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      console.log('Current User Info:', userInfo);
      
      setCurrentUser({
        avatar: userInfo.imageUrl,
        name: userInfo.name,
        color: 'bg-purple-600',
        imageUrl: userInfo.imageUrl 
      });

      let token = localStorage.getItem('token');
      token = JSON.parse(token);
      let response = await axios.get(`${BASE_URL}/fetchMessages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Fetched Messages:", response.data);

     
      const apiMessages = response.data.messages.map((msg) => ({
        id: msg._id,
        user: msg.user.name,
        avatar: msg.user.name.charAt(0).toUpperCase(),
        timestamp: new Date(msg.createdAt || Date.now()).toLocaleString('en-US', { 
          weekday: 'long', 
          hour: '2-digit', 
          minute: '2-digit' 
        }).toLowerCase(),
        content: msg.message,
        isCurrentUser: msg.user.email === userInfo.email,
        imageUrl: msg.user.imageUrl
      }));

      setMessages(apiMessages);

    } catch (e) {
      console.error('Error fetching messages:', e.message);
      toast.error('Failed to load messages', { containerId: 'chat' });
    }
  };

  return (
    <>
      <ToastContainer containerId={"chat"} />

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm h-[calc(100vh-200px)] flex flex-col">
       
        <div className="border-b border-gray-200 p-4">
          <div className="flex gap-4 items-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">#hello</button>
            <button className="text-gray-600 hover:text-gray-700 font-medium">#help</button>
          </div>
        </div>

      
        <div ref={messageAreaRef} id="messagearea" className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                
                <Avatar 
                  imageUrl={message.imageUrl}
                  name={message.user}
                  fallbackColor={message.isCurrentUser ? currentUser.color : 'bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400'}
                />
                
             
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{message.user}</span>
                   
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      
        <div className="px-6 pb-2 flex justify-end">
          <button 
            onClick={() => {
              const div = messageAreaRef.current;
              if (div) div.scrollTo({ top: div.scrollHeight, behavior: "smooth" });
            }}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

      
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
           
            <Avatar 
              imageUrl={currentUser.imageUrl}
              name={currentUser.name}
              fallbackColor={currentUser.color}
              size="w-8 h-8"
            />
            
            <span className="font-semibold text-gray-900 text-sm hidden md:block">{currentUser.name}</span>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminChat;