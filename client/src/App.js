import logo from './logo.svg';
import './App.css';
import './normalize.css'
import { useState ,useEffect} from 'react';
//import { response } from 'express';


function App() {

  useEffect(()=> {
    getEngines();

  }, [])

  const [input,setInput] = useState("");
  const [models,setModels] = useState([]);

  const [chatlog,setChatLog] = useState([{
    user: "gpt",
    message: "How can ı help sir? "
  },{
    user: "me",
    message: "I want to use KBot"
  }

]);

function clearChat(){
   setChatLog([]); 
}

function getEngines(){
  fetch("http://localhost:3080/")
  .then(res=> res.json())
  .then(data=> {
    console.log(data.models.data)
    setModels(data.models.data)
  })
}

  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatlog, { user: "me", message: `${input} `} ]
    setInput("");
    setChatLog(chatLogNew)
    const messages = chatLogNew.map((message) => message.message).join("\n")
  
    //fetch response to the api combining the chat log array of messages and sending it as messages to the localhost:3000 as a post
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers:  {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
       message: messages
      })
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message} `} ])
  }
  
  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
         <span>+</span> 
          New chat
        </div>
        <div className="models">
          <select >
            {models.map((model, index) => (
            <option key={model.id} value={model.id}>{model.id}
            </option>
            
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
        {chatlog.map((message,index)=> (
            <ChatMessage key ={index} message={message} />
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input 
            rows ="1"
            value={input}
            onChange={(e)=>setInput(e.target.value) }
             className="chat-input-textarea"></input>

          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) =>{
  return(
    <div className={`chat-message ${message.user = "gpt" && "chatgpt"}`}>
            <div className="chat-message-center">
            <div className={`avatar ${message.user = "gpt" && "chatgpt"}`}>
            </div>
            <div className="message">   
                {message.message}
            </div>
            </div>
          </div>
  )
}

export default App;
