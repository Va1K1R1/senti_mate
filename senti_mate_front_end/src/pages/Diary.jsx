import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../component/Header.jsx";
import Button from "../component/Button.jsx";
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
                <Button text="← 뒤로가기" onClick={() => navigate(-1)} />
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
    const title = `${getFormattedDate(new Date(date))} 기록`;

    return (
        <div>
            <Header
                title={title}
                leftChild={<Button text="< 뒤로가기" onClick={goBack} />}
                rightChild={<Button text="수정하기" onClick={goEdit} />}
            />

            <Viewer content={content} emotionId={emotionId} />
        </div>
    );
};

export default Diary;
