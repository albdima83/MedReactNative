import { useEffect, useRef } from "react"
const TVEventHandler = require('TVEventHandler');


function useKeyboard(callback: () => void) {
    const savedCallback = useRef(callback);
    const tvEventHandler = useRef(new TVEventHandler());

    useEffect(() => {
      
  
      return () => {
        tvEventHandler.current?.disable();
      }
    },[]);
  }

  export default useKeyboard;