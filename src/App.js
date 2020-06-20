import React from 'react';
import './App.css';
import Dashboard from "./components/dashboard/dashboard";
import Test from "./components/test";

const App = () => {
  return (
      <div className={`app-container`}>
        <Dashboard />
        {/*<Test />*/}
      </div>
  );
}

export default App;
