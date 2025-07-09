import React from 'react';
import Mainpage from "./components/mainpage";

// ✅ Log the backend URL for testing
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/todos`;
console.log("API_URL:", API_URL); // ✅ For testing



const App = () => {
  return (
    <div>
      <Mainpage apiUrl={API_URL} />
    </div>
  );
};

export default App;
