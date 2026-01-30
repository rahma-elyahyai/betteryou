// src/hooks/useRestTimer.js
import { useRef, useState } from "react";

export default function useRestTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const initialRef = useRef(initialSeconds);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);

    clear();
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear();
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clear();
    setIsRunning(false);
  };

  const reset = () => {
    clear();
    setIsRunning(false);
    setSeconds(initialRef.current || 0);
  };

  const resetTo = (value) => {
    clear();
    setIsRunning(false);
    initialRef.current = value || 0;
    setSeconds(value || 0);
  };

  return { seconds, isRunning, start, pause, reset, resetTo };
}
