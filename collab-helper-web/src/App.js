import React from 'react';
//import logo from './logo.svg';
//import './App.css';
import Application from "./Components/Application";
import UserProvider from "./providers/UserProvider";

function App() {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}
export default App;
