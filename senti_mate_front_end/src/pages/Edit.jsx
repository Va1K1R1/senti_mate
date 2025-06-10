import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "../component/Header.jsx";
import Editor from "../component/Editor.jsx";
import { updateDiaryEntry } from "../store/slices/diarySlice";

const Edit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const diaryEntries = useSelector((state) => state.diary.diaryEntries);
    const data = diaryEntries.find((entry) => String(entry.id) === id);

    if (!data) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>수정할 일기를 찾을 수 없어요.</p>
                <div className="left-child" onClick={() => navigate(-1)}>← 뒤로가기</div>
            </div>
        );
    }

    const onSubmitEdit = (updatedData) => {
        dispatch(updateDiaryEntry(updatedData));
        alert("일기가 수정되었습니다.");
        navigate(`/diary/${id}`);
    };

    return (
        <>
            <Header
                title="일기 수정"
                leftChild={<div className="left-child" onClick={() => navigate(-1)}>← 뒤로가기</div>}
            />
            <Editor isEditMode initialData={data} onSubmit={onSubmitEdit} />
        </>
    );
};

export default Edit;
