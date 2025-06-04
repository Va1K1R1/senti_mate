import React from 'react';
import Header from '../component/Header';
import DiaryList from '../component/DiaryList';
import TodoList from '../component/TodoList';
import HealthDataSummary from '../component/HealthDataSummary';
import RecommendationList from '../component/RecommendationList';
import EmotionChart from '../component/EmotionChart';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <Header 
        headText="Dashboard" 
        leftChild={<div className="left_btn">◀</div>}
        rightChild={<div className="right_btn">▶</div>}
      />

      <div className="dashboard_container">
        <section className="dashboard_section">
          <h2>Health Overview</h2>
          <div className="dashboard_card">
            <HealthDataSummary />
          </div>
        </section>

        <section className="dashboard_section">
          <h2>Recent Emotions</h2>
          <div className="dashboard_card">
            <EmotionChart />
          </div>
        </section>

        <section className="dashboard_section">
          <h2>Recent Diary Entries</h2>
          <div className="dashboard_card">
            <DiaryList />
          </div>
        </section>

        <section className="dashboard_section">
          <h2>Todo List</h2>
          <div className="dashboard_card">
            <TodoList />
          </div>
        </section>

        <section className="dashboard_section">
          <h2>Recommendations</h2>
          <div className="dashboard_card">
            <RecommendationList />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
