import './App.css'

// Router
import { Routes, Route } from 'react-router-dom';


// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';


function App() {
  return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
