import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../component/Header.jsx";
import Button from "../component/Button.jsx";
import Editor from "../component/Editor.jsx";
import useDiary from "../hooks/useDiary.jsx";

const Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const data = useDiary(id);

    if (!data) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>수정할 일기를 찾을 수 없어요.</p>
                <Button text="← 뒤로가기" onClick={() => navigate(-1)} />
            </div>
        );
    }

    const goBack = () => {
        navigate(-1);
    };

    // 실제 수정 로직 대신 예시로 alert 처리
    const onEdit = (updatedData) => {
        console.log("수정된 일기 데이터:", updatedData);
        alert("일기가 수정되었습니다.");
        navigate(`/diary/${id}`, { replace: true });
    };

    return (
        <div>
            <Header
                title="일기 수정"
                leftChild={<Button text="< 뒤로가기" onClick={goBack} />}
                rightChild={<Button text="저장" onClick={() => onEdit(/*임시 예시*/)} />}
            />
            <Editor isEditMode initialData={data} />
        </div>
    );
};

export default Edit;
