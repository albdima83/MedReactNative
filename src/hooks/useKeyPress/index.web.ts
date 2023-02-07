import React from "react";
import { IUseKeyPress, KEYS_MAP, KEYS_VALUE } from "./keys";


const useKeyPress = (props:IUseKeyPress) => {
    
    const _keyDownHandler = (ev: KeyboardEvent) => {
      if (ev.defaultPrevented) {
         // Do nothing if the event was already processed
        return;
      }
      ev.stopPropagation();
      ev.preventDefault();
      console.log(ev);
      const key = ev.key;
      const code = ev.code;  
      const keyMap = KEYS_MAP.find((keyMap) => {
        return (keyMap.keys.indexOf(key) > -1)
      })
      if(!!keyMap){
        console.log(`onKeyPressed [${keyMap.code}]`);
        if(props.onKeyPressed){
          props.onKeyPressed(keyMap.code);
        }
      }
    }
    const _keyUpHadler = (ev: KeyboardEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        console.log(ev);
        const key = ev.key;
        const code = ev.code;  
        const keyMap = KEYS_MAP.find((keyMap) => {
          return (keyMap.keys.indexOf(key) > -1)
        })
        if(!!keyMap){
          console.log(`onKeyUp [${keyMap.code}]`);
          if(props.onKeyUp){
            props.onKeyUp(keyMap.code);
          }
        }
    }
  
    React.useEffect(() => {
      window.addEventListener("keydown", _keyDownHandler);
      window.addEventListener("keyup", _keyUpHadler);
  
      return () => {
        window.removeEventListener("keydown", _keyDownHandler);
        window.removeEventListener("keyup", _keyUpHadler);
      };
    });
  
    return [];
};

export default useKeyPress;
  