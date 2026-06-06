import { useState, useEffect } from 'react';

interface UseNavigationTimerProps {
  startDate: Date;
}

export function useNavigationTimer({ startDate }: UseNavigationTimerProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = startDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsEnabled(true);
        setRemainingTime('Its time for pickup');
        return true;
      }

      // (Horas, minutos, segundos)
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Formateo con ceros a la izquierda (00:00:00)
      const pad = (num: number) => String(num).padStart(2, '0');
      setRemainingTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      setIsEnabled(false);
      return false;
    };

    const isFinished = calculateTime();
    if (isFinished) return;

    const intervalId = setInterval(() => {
      const finished = calculateTime();
      if (finished) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startDate]);

  return { isEnabled, remainingTime };
}