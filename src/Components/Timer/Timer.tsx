import React, { useEffect } from 'react'
import { useTimer } from 'react-timer-hook';
interface TimerProps {
    expiryTimestamp: Date;
    onExpire: () => void;
    iniciar: boolean;
}
const Timer = ({ expiryTimestamp, onExpire, iniciar }: TimerProps) => {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp: expiryTimestamp, onExpire: onExpire });

    useEffect(() => {
        console.log('active')
        if (iniciar) {
            restart(expiryTimestamp)
        } else {
            pause()
        }
    }, [iniciar])
        console.log(hours, minutes,seconds)
    return (
        <div>
           {/*  {hours}:{minutes}:{seconds} */}
        </div>
    )
}

export default Timer
