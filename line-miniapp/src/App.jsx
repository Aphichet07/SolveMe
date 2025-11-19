import { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header'
import SearchBar from './components/searchbar'
import LoadingCard from './components/LoadingCard'
import Home from './pages/Home.jsx'
import SplashPage from "./pages/splashpage.jsx"




function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashPage />;
  }

  return <Home />;
}

export default App
