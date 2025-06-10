import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header.jsx";
import Footer from "../component/Footer.jsx";
import DiaryService from "../services/DiaryService";

const NewEntry = () => {
    const navigate = useNavigate();
    const [title, setTitle]       = useState("");
    const [content, setContent]   = useState("");
    const [emotionId, setEmotion] = useState(null);
    const [error, setError]       = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // createEntry 사용
            await DiaryService.createEntry({ title, content, emotionId });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div>
            <Header
                title="새 일기 작성"
                leftChild={<div onClick={() => navigate(-1)}>← 뒤로가기</div>}
                rightChild={null}
            />
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="제목"
                />
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="내용"
                />
                {/* emotion 선택 UI */}
                <button type="submit">저장</button>
            </form>
            <Footer />
        </div>
    );
};

export default NewEntry;
