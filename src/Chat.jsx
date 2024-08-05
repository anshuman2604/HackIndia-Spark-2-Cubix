import React, { useState, useEffect } from 'react';
import Gun from 'gun';
import { nanoid } from 'nanoid';
import './Chat.css';

const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']);

const Chat = ({ roomCode, onGoHome }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy Room Code');
  const [error, setError] = useState('');

  useEffect(() => {
    const generatedUsername = `User-${nanoid(4)}`;
    setUsername(generatedUsername);
  }, []);

  useEffect(() => {
    if (roomCode) {
      const roomNode = gun.get(roomCode);
      setRoom(roomNode);

      roomNode.get('messages').map().on((msg, id) => {
        if (msg && id) {
          setMessages(prevMessages => {
            if (!prevMessages.find(message => message.id === id)) {
              return [...prevMessages, { id, ...msg }];
            }
            return prevMessages;
          });
        }
      });

      return () => {
        roomNode.get('messages').off();
      };
    }
  }, [roomCode]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setError('');
  };

  const sendMessage = () => {
    if (!message.trim()) {
      setError('Please write something.');
    } else if (!username) {
      setError('Please set your username.');
    } else if (room) {
      room.get('messages').set({ username, message });
      setMessage('');
      setError('');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
      .then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => {
          setCopyButtonText('Copy Room Code');
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="chat-container">
      <button className="button back" onClick={onGoHome}>Back to Home</button>
      <h1 className="chat-header">Room Code: {roomCode}</h1>
      <div className="username">Your Username: {username}</div>
      <button className="button copy" onClick={copyRoomCode}>{copyButtonText}</button>
      {error && <div className="error-message">{error}</div>}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea
          placeholder="Type your message here"
          onChange={handleMessageChange}
          value={message}
          className="textarea"
        />
        <button className="button send" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
