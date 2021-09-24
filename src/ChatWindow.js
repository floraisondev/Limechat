import React, {Component} from "react"
import { withStyles } from "@material-ui/core/styles";
import styles from "./ChatWindow.style"
import { Grid, TextField,Button } from "@material-ui/core";
import { FaAngleLeft, FaComment } from 'react-icons/fa';
import axios from "axios"
import moment from "moment";
import _ from "lodash";
import { IoSend } from "react-icons/io5";
import {IoIosSettings } from "react-icons/io";

class ChatWindow extends  React.Component {
    chatRef;
    intersectionObserver;
    constructor(){
    super();
    this.chatRef = React.createRef()
    this.state = {
        allChats : [],
        page : 0,
        newChat : null
    }
    this.intersectionObserver = new IntersectionObserver(entries => {
        var ratio = entries[0].intersectionRatio;
        if(ratio > 0){
        this.setState(prevState =>({
                   page :prevState.page + 1
                }),this.fetchMoreChats)
       } })
    
    };

    async fetchMoreChats(){
    const {page, allChats } = this.state;
     await axios.get(`https://retoolapi.dev/m89lfD/limechat?_page=${page}&_limit=15`)
          .then((response) => {
             
            // handle success
            this.setState({
                allChats : _.orderBy([...allChats, ...response.data],"Created At")
            })
           
            })
            .catch((error) => {
            // handle error
            console.error(error);
            })
    }

    sendChat = () => {
    this.setState({newChat : null})
    let timeStamp = + new Date()
    axios.post('https://retoolapi.dev/m89lfD/limechat', 
    {
     "Content": this.state.newChat,
     "Created At": timeStamp, 
     "Updated At": timeStamp
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
     
    }

    componentDidMount() {
        this.intersectionObserver.observe(this.chatRef.current);
        this.fetchMoreChats()  
       }
   
render() {
const {classes} = this.props;
    return(
        <>
        <Grid className={classes.chatContainer}>
            <div  ref={this.chatRef}>Hi</div>
             <Grid className = {classes.chatHeader} style ={{ display : "flex", justifyContent : "space-between"}}> 

                    <div style = {{ 
                        display : "flex",
                         margin : "15px 5px",
                         justifyContent : "space-evenly",
                         color : "#fff",
                         width : 150}}>
                    <FaAngleLeft  style ={{ fontSize : 20, cursor : "pointer" }}/> 
                    <FaComment style ={{ fontSize : 20 }}/> 
                    <div>Limechat</div>
                    </div>

                    <div style = {{
                        fontSize : 25,
                        color : "#fff",
                        cursor : "pointer",
                        margin : 15
                    }}>
                    <IoIosSettings />
                    </div>
                   
              </Grid>

          <Grid className = {classes.chat}>
                 {this.state.allChats.map((m) =>
                    m[`Message Type`] == 0 ? 
                    <>
                      <div className={classes.customerChatBubble}>
                          <div className={classes.customer}>
                            <div className={classes.msgInfo}>
                            <div style = {{ color : "#fff", fontWeight : "bold"}}>Customer</div>
                          <div style = {{ fontSize : 12, color : "#fff", marginTop : 5}}>{moment(m[`Created At`]).format('MM/DD/YYYY hh:mm a')}</div>
                            </div>
                         <div style = {{ color : "#fff", fontSize : 14, marginTop : 12, textAlign : "left"}}>{m.Content}</div>
                          </div>
                          </div>
                        </>  
                          :
                      <>
                      <div className={classes.agentChatBubble}>
                          <div className={classes.agent}>
                            <div className={classes.msgInfo}>
                            <div style = {{ color : "#000", fontWeight : "bold"}}>Agent</div>
                           <div style = {{ fontSize : 12, color : "#000", marginTop : 5}}>{moment(m[`Created At`]).format('MM/DD/YYYY hh:mm a')}</div>
                            </div>   
                         <div style = {{ color : "#000", fontSize : 14, marginTop : 12, textAlign : "left"}}>{m.Content}</div>
                          </div>
                          </div>
                    </>  
                  )} 
            </Grid>

            <Grid className = {classes.sendMessageArea}>
                <TextField  
                 InputProps={{ disableUnderline: true }}
                 className={classes.messageInput}
                 value = {this.state.newChat} 
                onChange = {(e) => this.setState({newChat : e.target.value})} 
                placeholder = {"Enter you message here..."}
                />

                <Button
                  className={classes.sendButton}
                 onClick = {this.sendChat}>Send</Button> 

                <Button className = {classes.sendIcon}
                onClick = {this.sendChat}>
                 <IoSend />
                </Button>
            </Grid>
        </Grid>  
     </>
    )}
}

export default  withStyles(styles)(ChatWindow)