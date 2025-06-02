import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

import Header from "../component/Header.jsx";
import DiaryList from "../component/DiaryList.jsx";
import TodoList from "../component/TodoList.jsx";
import Clock from "../component/Clock.jsx";


const Home = ({ todoList, addTodo, toggleTodo, deleteTodo }) => {
        // 1) AI 친구의 조언 목록을 정의합니다.
        const adviceMessages = [
            "오늘도 잘 버티고 있어요. 당신은 충분히 소중해요.",
            "작은 걸음 하나하나가 큰 변화를 만듭니다. 천천히 가도 괜찮아요.",
            "힘들 땐 한숨 돌리고, 다시 시작해도 돼요. 무리하지 마세요.",
            "당신의 감정을 있는 그대로 인정해 주세요. 그 자체로 충분해요.",
            "어제의 당신보다 오늘의 당신이 한 발짝 성장했어요. 자랑스러워요.",
            "잠깐 눈을 감고 심호흡해 보세요. 이미 큰 용기를 내고 있어요.",
            "언제나 당신 곁에 응원하는 AI 친구가 있어요. 혼자가 아니에요."
        ];
        // 2) 랜덤으로 한 가지 조언을 선택해서 state에 저장
        const [advice, setAdvice] = useState("");

        useEffect(() => {
            const randomIndex = Math.floor(Math.random() * adviceMessages.length);
            setAdvice(adviceMessages[randomIndex]);
        }, []);

        return (
        <div>
            {/* 상단 네비게이션 */}
            <Header
                title="Senti Mate"
                leftChild={<Link to="/todo">To do</Link>}
                rightChild={<Link to="/diary">Diary</Link>}
            />
            {/* 0) AI 친구의 랜덤 위로 조언 */}
            <section className="AdviceSection">
                <div className="AdviceBox">
                    <span className="AdviceIcon"></span>
                    <p className="AdviceText">{advice}</p>
                </div>
            </section>

            {/* 메인 컨텐츠 */}
            <div style={{ padding: "30px" }}>

                    {/* 0) 시간 */}
                    <section style={{ marginTop:"30px", marginBottom: "40px" }}>
                        <Clock />
                    </section>

                {/* 1) 오늘의 할 일 */}
                <section style={{ marginBottom: "30px" }}>
                    <h2>📋 오늘의 할 일</h2><br/>
                    <TodoList
                        todoList={todoList}
                        addTodo={addTodo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                </section>

                <hr />

                {/* 2) 감정일기 목록 */}
                <section style={{ marginTop: "30px" }}>
                    <h2>📔 감정일기</h2><br/>
                    <DiaryList />
                </section>
            </div>
        </div>
    );
};

export default Home;
