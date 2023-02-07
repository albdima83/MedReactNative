import React, { useRef } from "react";
import { useState } from "react";
import { IUseKeyPress, KEYS_VALUE } from "./keys";

const TVEventHandler = require('TVEventHandler');

const useKeyPress = (props:IUseKeyPress) => {

    const tvEventHandler = useRef(new TVEventHandler());
    const [keyPressed, setKeyPressed] = useState<KEYS_VALUE | null | undefined>();
    const [keyup, setKeyUp] = useState<KEYS_VALUE | null | undefined>();

    const _callbackKeyEvent = (cmp:any, evt:any) => {
        console.log(evt);
        if (evt && evt.eventType === 'right') {
        } else if(evt && evt.eventType === 'up') {
        } else if(evt && evt.eventType === 'left') {
        } else if(evt && evt.eventType === 'down') {
        } else if(evt && evt.eventType === 'playPause') {
        }
        
    }

    React.useEffect(() => {
      tvEventHandler.current.enable(_callbackKeyEvent);
      return () => {
        tvEventHandler.current.disable();
      };
    });
  
    return [keyPressed,keyup];
};
  
export default useKeyPress;