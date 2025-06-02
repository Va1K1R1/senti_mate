import React, { useEffect, useRef } from "react";
import "./Clock.css";

const Clock = () => {
    const hourHandRef = useRef();
    const minuteHandRef = useRef();
    const secondHandRef = useRef();

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
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
        };

        // 처음 한 번 실행
        updateClock();
        // 1초마다 업데이트
        const timerId = setInterval(updateClock, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="Clock">
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
    );
};

export default Clock;
