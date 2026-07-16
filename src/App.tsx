import './App.css'

// Router
import { Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Main_header';

// Pages
import Home from './pages/Home';


function App() {
  return (
      <div>
        <Header />

        <main style={{ padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
