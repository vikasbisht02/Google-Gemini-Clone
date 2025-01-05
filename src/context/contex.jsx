/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import runChat from "../config/gemini";


export const Context =  createContext();

const ContextProvider = (props) => {

    const[input, setInput] = useState("");
    const[recentPrompt, setRecentPrompt] = useState("");
    const[prePrompt, setPreprompt] = useState([]);
    const[showResult, setShowresult] = useState(false);
    const[loading, setLoading] = useState(false);
    const[resultData, setResultData] = useState("");

    const delayPara = (index, nextword) => {
        setTimeout(function() {
            setResultData(prev=> prev+nextword)
        }, 75*index);
    }

    const newChat = () => {
        setLoading(false);
        setShowresult(false);
    }
    

    const onSent = async  (prompt) => {
        setResultData("");
        setLoading(true);
        setShowresult(true);
        let respons;
        if(prompt !== undefined) {
            respons = await runChat(prompt);
            setRecentPrompt(prompt);
        } else {
            setPreprompt(prev => [...prev, input]);
            setRecentPrompt(input);
            respons = await runChat(input);
            
        }

        let responsArray = respons.split("**");
        let newResponse =  "";
        for(let i=0; i<responsArray.length; i++) {
            if(i===0 || i%2 !== 1) {
                newResponse += responsArray[i]
            } else {
                newResponse += "<b>" + responsArray[i] + "</b>"

            }
        }
       
        let newResponse2 =  newResponse.split("*").join("</br");
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length; i++) {
            const nextword = newResponseArray[i];
            delayPara(i, nextword +  " ");
        }

        setLoading(false);
        setInput("");
    }

    const contextValue = {
        prePrompt,
        setPreprompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
