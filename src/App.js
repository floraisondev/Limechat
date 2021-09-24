import logo from './logo.svg';
import './App.css';
import ChatWindow from "./ChatWindow"
import React, {useEffect, useState} from "react"
import axios from "axios"
const App = () => {
 useEffect(() => {
   getAllMessages()
 },[])
  const [allMessages, setAllMessages] = useState(null)
  
  const getAllMessages = () => {
    axios.get("https://retoolapi.dev/m89lfD/limechat")
    .then((response) => {
      // handle success
      // console.log(response)
      setAllMessages(response)
    })
    .catch((error) => {
      // handle error
      console.error(error);
    })
  } 


  return (
    <div className="App">
    <ChatWindow allMessages = {allMessages ? allMessages : null}/>
    </div>
  );
}

export default App;
