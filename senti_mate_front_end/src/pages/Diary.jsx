import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../component/Header.jsx";
import Viewer from "../component/Viewer.jsx";
import { getFormattedDate } from "../util.jsx";
import Footer from "../component/Footer.jsx";

const Diary = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const diaryEntries = useSelector((state) => state.diary.diaryEntries);

    const entry = diaryEntries.find((item) => String(item.id) === String(id));

    if (!entry) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>해당 일기를 찾을 수 없어요.</p>
                <div
                    className="left-child Button Button_default"
                    onClick={() => navigate(-1)}
                    style={{ display: "inline-block", cursor: "pointer" }}
                >
                    ← 뒤로가기
                </div>
            </div>
        );
    }

    const { date, emotionId, content } = entry;
    const title = `${getFormattedDate(new Date(date))}`;

    return (
        <div>
            <Header
                title={title}
                leftChild={
                    <div className="left-child" onClick={() => navigate(-1)}>
                        ← 뒤로가기
                    </div>
                }
                rightChild={
                    <div className="right-child" onClick={() => navigate(`/diary/edit/${id}`)}>
                        수정하기
                    </div>
                }
            />
            <Viewer content={content} emotionId={emotionId} />
        </div>



    );
};

export default Diary;
