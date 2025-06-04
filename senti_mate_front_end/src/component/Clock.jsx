import React, { useState, useEffect, useRef } from "react";
import "./Clock.css";

/**
 * Enhanced Clock component with both analog and digital display
 * @param {boolean} showDigital - Whether to show digital clock (default: true)
 * @param {boolean} showAnalog - Whether to show analog clock (default: true)
 * @param {boolean} showSeconds - Whether to show seconds in digital clock (default: true)
 * @param {boolean} use24Hour - Whether to use 24-hour format in digital clock (default: false)
 */
const Clock = ({ 
    showDigital = true, 
    showAnalog = true, 
    showSeconds = true,
    use24Hour = false
}) => {
    const hourHandRef = useRef();
    const minuteHandRef = useRef();
    const secondHandRef = useRef();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTime(now);

            if (showAnalog) {
                const seconds = now.getSeconds();
                const minutes = now.getMinutes();
                const hours = now.getHours() % 12;

                // 360deg 기준 각도 계산
                const secondDeg = (seconds / 60) * 360;
                const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
                const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

                if (secondHandRef.current)
                    secondHandRef.current.style.transform = `rotate(${secondDeg}deg)`;
                if (minuteHandRef.current)
                    minuteHandRef.current.style.transform = `rotate(${minuteDeg}deg)`;
                if (hourHandRef.current)
                    hourHandRef.current.style.transform = `rotate(${hourDeg}deg)`;
            }
        };

        // 처음 한 번 실행
        updateClock();
        // 1초마다 업데이트
        const timerId = setInterval(updateClock, 1000);

        return () => clearInterval(timerId);
    }, [showAnalog]);

    // Format time for digital display
    const formatTime = () => {
        let hours = time.getHours();
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        let ampm = '';

        if (!use24Hour) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be displayed as 12
        }

        hours = hours.toString().padStart(2, '0');

        return {
            hours,
            minutes,
            seconds,
            ampm
        };
    };

    const { hours, minutes, seconds, ampm } = formatTime();

    return (
        <div className="Clock">
            {showDigital && (
                <div className="digital-clock">
                    <span className="digital-time">
                        {hours}:{minutes}{showSeconds ? `:${seconds}` : ''}
                    </span>
                    {!use24Hour && <span className="digital-ampm">{ampm}</span>}
                </div>
            )}

            {showAnalog && (
                <div className="analog-clock">
                    <div className="clock-face">
                        <div ref={hourHandRef} className="hand hour-hand" />
                        <div ref={minuteHandRef} className="hand minute-hand" />
                        <div ref={secondHandRef} className="hand second-hand" />
                        {/* 숫자 대신 눈금만 넣고 싶으면 아래 숫자 주석 처리 */}
                        <div className="number number1">1</div>
                        <div className="number number2">2</div>
                        <div className="number number3">3</div>
                        <div className="number number4">4</div>
                        <div className="number number5">5</div>
                        <div className="number number6">6</div>
                        <div className="number number7">7</div>
                        <div className="number number8">8</div>
                        <div className="number number9">9</div>
                        <div className="number number10">10</div>
                        <div className="number number11">11</div>
                        <div className="number number12">12</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clock;
