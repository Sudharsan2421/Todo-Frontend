import React from 'react';
import Mainpage from "./components/mainpage";

// ✅ Log the backend URL for testing
const API_URL = 'https://todo-backend-yzxh.onrender.com';

console.log("API_URL:", API_URL); // ✅ For testing



const App = () => {
  return (
    <div>
      <Mainpage apiUrl={API_URL} />
    </div>
  );
};

export default App;
