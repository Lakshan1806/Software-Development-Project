import { useState, useEffect } from "react";

const useCountdown = (initialSeconds = 30) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const start = (time = initialSeconds) => {
    setSecondsLeft(time);
    setIsActive(true);
  };

  const reset = () => {
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  return { secondsLeft, isActive, start, reset };
};

export default useCountdown;
