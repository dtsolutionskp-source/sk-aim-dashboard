import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Marketing from './pages/Marketing';
import DataAnalysis from './pages/DataAnalysis';
import SurveyAnalysis from './pages/SurveyAnalysis';
import PerformanceReport from './pages/PerformanceReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="data-analysis" element={<DataAnalysis />} />
          <Route path="survey" element={<SurveyAnalysis />} />
          <Route path="report" element={<PerformanceReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
