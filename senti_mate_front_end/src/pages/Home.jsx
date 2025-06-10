// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService   from "../services/AuthService";
import DiaryService  from "../services/DiaryService";
import TodoService   from "../services/TodoService";
import Header        from "../component/Header.jsx";
import Clock         from "../component/Clock.jsx";
import HomeTodoList  from "../component/HomeTodoList.jsx";
import DiaryList     from "../component/DiaryList.jsx";
import Footer        from "../component/Footer.jsx";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [advice, setAdvice]   = useState("");
    const [diaries, setDiaries] = useState([]);
    const [todos, setTodos]     = useState([]);

    // 로그인 여부 확인
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        // 로그인 안 된 상태면 로그인 페이지로 리다이렉트
        if (!currentUser) {
            navigate("/login");
            return;
        }

        // 랜덤 조언 하나 뽑기
        const msgs = [
            "오늘도 잘 버티고 있어요. 당신은 충분히 소중해요.",
            "작은 걸음 하나하나가 큰 변화를 만듭니다. 천천히 가도 괜찮아요.",
            "힘들 땐 한숨 돌리고, 다시 시작해도 돼요. 무리하지 마세요.",
            "당신의 감정을 있는 그대로 인정해 주세요. 그 자체로 충분해요.",
            "어제의 당신보다 오늘의 당신이 한 발짝 성장했어요. 자랑스러워요.",
            "잠깐 눈을 감고 심호흡해 보세요. 이미 큰 용기를 내고 있어요.",
            "언제나 당신 곁에 응원하는 친구가 있어요. 혼자가 아니에요."
        ];
        setAdvice(msgs[Math.floor(Math.random() * msgs.length)]);

        // 다이어리 불러오기 (현재 유저 기준)
        DiaryService.getAllEntries()
            .then(setDiaries)
            .catch(console.error);

        // Todo 불러올 때 userId 직접 넘기기
        TodoService.getAllTodos(currentUser.id)
            .then(setTodos)
            .catch(console.error);

    }, [currentUser, navigate]);

    const addTodo = async text => {
        const newT = await TodoService.createTodo({ text, completed: false }, currentUser.id);
        setTodos(prev => [...prev, newT]);
    };
    const toggleTodo = async id => {
        const t = todos.find(t => t.id === id);
        const updated = await TodoService.updateTodo(id, { ...t, completed: !t.completed });
        setTodos(prev => prev.map(x => x.id === id ? updated : x));
    };
    const deleteTodo = async id => {
        await TodoService.deleteTodo(id);
        setTodos(prev => prev.filter(x => x.id !== id));
    };

    return (
        <div className="HomeContainer">
            <Header
                title="Senti Mate"
                leftChild={<Link to="/todo">To do</Link>}
                rightChild={<Link to="/diary">Diary</Link>}
            />
            <div className="HomeContent">
                <div className="TopSectionWrapper">
                    <div className="LeftColumn">
                        <div className="ClockWrapper">
                            <Clock />
                        </div>
                        <div className="AdviceBox">
                            <span className="AdviceIcon">·̑.̮·̑</span>
                            <p className="AdviceText">{advice}</p>
                        </div>
                    </div>
                    <div className="RightColumn">
                        <HomeTodoList
                            todoList={todos}
                            addTodo={addTodo}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                        />
                    </div>
                </div>
                <hr className="Divider" />
                <div className="DiarySection">
                    <h2 className="SectionTitle">📔 감정일기</h2>
                    <DiaryList entries={diaries} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
