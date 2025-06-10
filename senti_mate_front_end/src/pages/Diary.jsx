import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../component/Header.jsx";
import Viewer from "../component/Viewer.jsx";
import Footer from "../component/Footer.jsx";
import DiaryService from "../services/DiaryService";

const Diary = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        // getEntryById 사용
        DiaryService.getEntryById(id)
            .then(data => setEntry(data))
            .catch(console.error);
    }, [id]);

    if (!entry) return <div>로딩 중…</div>;

    return (
        <div>
            <Header
                title={entry.title || new Date(entry.createdAt).toLocaleDateString()}
                leftChild={<div onClick={() => navigate(-1)}>← 뒤로가기</div>}
                rightChild={<div onClick={() => navigate(`/diary/edit/${id}`)}>수정하기</div>}
            />
            <Viewer content={entry.content} emotionId={entry.emotions?.[0]?.id} />
            <Footer />
        </div>
    );
};

export default Diary;
