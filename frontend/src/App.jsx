import { useState } from 'react';
import WelcomePage from '@components/pages/WelcomePage.jsx';
import ParameterSelectionPage from '@components/pages/ParameterSelectionPage.jsx';
import ResultsPage from '@components/pages/ResultsPage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome', 'parameters', 'results'
  const [calculationData, setCalculationData] = useState(null);

  const navigateToParameters = () => {
    setCurrentPage('parameters');
  };

  const navigateToResults = (data) => {
    setCalculationData(data);
    setCurrentPage('results');
  };

  const navigateBackToParameters = () => {
    setCurrentPage('parameters');
  };

  return (
    <div className="h-screen flex flex-col dark bg-slate-950 text-slate-100">
      {currentPage === 'welcome' && (
        <WelcomePage onStart={navigateToParameters} />
      )}
      
      {currentPage === 'parameters' && (
        <ParameterSelectionPage onCalculate={navigateToResults} />
      )}
      
      {currentPage === 'results' && (
        <ResultsPage 
          data={calculationData} 
          onBack={navigateBackToParameters} 
        />
      )}
    </div>
  );
}
