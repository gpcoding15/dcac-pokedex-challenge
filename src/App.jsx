import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Team } from './pages/Team/Team';
import { PokemonDetail } from './pages/PokemonDetail/PokemonDetail';
import { Navbar } from './components/Navbar/Navbar';
import styles from './App.module.css';

// Compare pulls in Recharts, Formik and Yup, which are only needed on this
// one route — loading it lazily keeps those out of the initial bundle.
const Compare = lazy(() =>
  import('./pages/Compare/Compare').then((module) => ({ default: module.Compare }))
);

export const App = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className={styles.loading}>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </Suspense>
    </>
  )
};
