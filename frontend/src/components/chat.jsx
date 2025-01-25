import React, { useState } from "react";
//import {FourSquare} from "react-loading-indicators";
//import Navbar from "./navbar/navbar";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [display,setDisplay] = useState("none");

  const botReplies = async (userMessage) => {

    const data = {
      chat:userMessage
    }
    return await fetch("http://127.0.0.1:4000/chat", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => { 
      return response.json().then((data) => {
          console.log(data);
          return data.message;
      }).catch((err) => {
          console.log(err);
      }) 
  });

    
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async() => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "User",
      text: input,
      time: getCurrentTime(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    
    setDisplay("")
    const botMessage = {
      sender: "Bot",
      text: await botReplies(input),
      time: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setDisplay("none")
    //var reply = await botReplies(input) 
    // setTimeout(() => {
    //   setDisplay("none")
    //   setMessages((prevMessages) => [...prevMessages, botMessage]);
    // }, 2000); // Simulate typing delay
    setInput(""); // Clear input field
  };


  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "50%",
      margin: "auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
    },
    chatWindow: {
      flex: 1,
      padding: "10px",
      overflowY: "auto",
      backgroundColor: "#f9f9f9",
      
    },
  
    loading:{
      color: "blue",
      display: display,
    },
    messageContainer: {
      margin: "10px 0",
      padding: "10px",
      borderRadius: "8px",
      maxWidth: "70%",
      boxSizing: "border-box",
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#d1e7dd",
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#f8d7da",
    },
    messageHeader: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.85em",
      marginBottom: "5px",
      color: "#555",
    },
    sender: {
      fontWeight: "bold",
    },
    time: {
      fontStyle: "italic",
    },
    messageText: {
      fontSize: "1em",
    },
    inputArea: {
      display: "flex",
      padding: "10px",
      borderTop: "1px solid #ddd",
      backgroundColor: "#fff",
    },
    input: {
      flex: 1,
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      marginRight: "5px",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <>
    {/* <Navbar/> */}
    <div style={styles.container}>
      <h3>MedBot</h3>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              ...(msg.sender === "User" ? styles.userMessage : styles.botMessage),
            }}
          >
            <div style={styles.messageHeader}>
              <span style={styles.sender}>{msg.sender}</span>
              <span style={styles.time}>{msg.time}</span>
            </div>
            <div style={styles.messageText}>{msg.text}</div>
          </div>
        ))}
        <div style={styles.loading}>
          loading...
        </div>
      </div>
     
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
    </>
  );
};



export default Chat;
