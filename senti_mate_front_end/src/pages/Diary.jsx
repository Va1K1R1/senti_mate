import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../component/Header.jsx";
import useDiary from "../hooks/useDiary.jsx";
import Viewer from "../component/Viewer.jsx";
import { getFormattedDate } from "../util.jsx";

const Diary = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const data = useDiary(id);

    if (!data) {
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

    const goBack = () => {
        navigate(-1);
    };
    const goEdit = () => {
        navigate(`/edit/${id}`);
    };

    const { date, emotionId, content } = data;
    const title = `${getFormattedDate(new Date(date))}`;

    return (
        <div>
            <Header
                title={title}
                leftChild={
                    <div
                        className="left-child"
                        onClick={goBack}
                    >
                        ← 뒤로가기
                    </div>
                }
                rightChild={
                    <div
                        className="right-child"
                        onClick={goEdit}
                    >
                        수정하기
                    </div>
                }
            />

            <Viewer content={content} emotionId={emotionId} />
        </div>
    );
};

export default Diary;
