import React from 'react';
import Mainpage from "./components/mainpage";

// ✅ Log the backend URL for testing
console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/todos`;

const App = () => {
  return (
    <div>
      <Mainpage apiUrl={API_URL} />
    </div>
  );
};

export default App;
