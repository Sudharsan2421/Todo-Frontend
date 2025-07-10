import React from 'react';
import Mainpage from "./components/mainpage";

// ✅ Use the env variable
const API_URL = process.env.REACT_APP_API_BASE_URL;

console.log("API_URL:", API_URL); // For confirmation in browser console

const App = () => {
  return (
    <div>
      <Mainpage apiUrl={API_URL} />
    </div>
  );
};

export default App;
