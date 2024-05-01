import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import LanguageDropdown from "./LanguageDropdown";
export default function CodeEditor({setruncode , setlanguage}) {

const[code , setCode ] = useState(null);
const[language, setLanguage] = useState("");
const onSelectChange = (sl) => {
        setLanguage(sl);
        setlanguage(sl)
  }; 
  useEffect(
    ()=>{
        setCode("");
    }
    ,[language])
  return (
    <>
    <div className=' flex  flex-col justify-center mt-10 mb-10'>
        
     <LanguageDropdown onSelectChange =  {onSelectChange}
        
     />
    <AceEditor
        height="600px"
        width='1000px'
        mode={language}
        value={code}
        theme="monokai"
        fontSize="16px"
        highlightActiveLine={true}
        setOptions={{
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2,
            }}
            onChange={(e)=>{
              setruncode(e)
              setCode(e)}}
            />
            </div>
           
       
            </>

  )
}
