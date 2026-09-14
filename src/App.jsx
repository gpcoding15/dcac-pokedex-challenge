import { Routes, Route } from 'react-router-dom';
import { Home, Team, Compare, PokemonDetail } from './pages'

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home/>} />
      <Route path="/pokemon/:id" element={ <PokemonDetail/>} />
      <Route path="/team" element={<Team/>} />
      <Route path="/compare" element={<Compare/>} />
    </Routes>
  )
};