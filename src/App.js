import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainComponent from "./component/MainComponent";

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
