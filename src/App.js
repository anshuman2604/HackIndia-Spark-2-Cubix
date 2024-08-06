import React, { useState } from 'react';
import Chat from './Chat';
import './App.css';
import video from './back.mp4';
import logo from './k8PlUgrh_4x-removebg-preview.png';

const App = () => {
  const [roomCode, setRoomCode] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState('');

  const roomExists = (code) => {
    return code.trim() !== '';
  };

  const handleCreateRoom = (newRoomCode) => {
    setRoomCode(newRoomCode);
    setShowChat(true);
    setError('');
  };

  const handleJoinRoom = (code) => {
    if (!code.trim()) {
      setError('Please enter a room code.');
    } else if (!roomExists(code)) {
      setError('Room code not found. Please try again.');
    } else {
      setRoomCode(code);
      setShowChat(true);
      setError('');
    }
  };

  const handleGoHome = () => {
    setRoomCode('');
    setShowChat(false);
  };


  const handleRedirect = () => {
    window.location.href = 'https://my-contact.azurewebsites.net/contact-us';
  };

  return (
    <>

      <div className='nav'>

      <div className='logo'>

      <img src={logo} alt="react logo" />

      </div>

        <ul>
          <li>About Us</li>
          <li onClick={() => {handleRedirect()}}>Contact Us</li>
        </ul>

      </div>

      <div className='video'>
        <video autoPlay muted loop>
          <source src={video} type="video/mp4" />
        </video>
      </div>

      <div className="app-container">

        {!showChat ? (
          <div className="home-page">
            <h1 className="home-header">PRIVAZO</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="create-room-section">
              <button
                className="button primary"
                onClick={() => handleCreateRoom('room-' + Math.random().toString(36).substring(2, 8))}
              >
                Create Random Room
              </button>
            </div>
            <div className="join-room-section">
              <input
                type="text"
                placeholder="Enter Room Code Or Create One"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="input"
              />
              <button
                className="button secondary"
                onClick={() => handleJoinRoom(roomCode)}
              >
                Join Room
              </button>

            </div>
          </div>
        ) : (
          <Chat roomCode={roomCode} onGoHome={handleGoHome} />
        )}
      </div>
    </>
  );
};

export default App;

