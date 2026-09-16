import { Routes, Route } from 'react-router-dom';
import { Home, Team, Compare, PokemonDetail } from './pages'
import { Navbar } from './components/Navbar/Navbar';

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </>
  )
};