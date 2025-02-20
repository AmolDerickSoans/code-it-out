import React from 'react';
import './App.css';
import SalesDashboard from './SalesDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <SalesDashboard />
      </ErrorBoundary>
    </div>
  );
}

export default App;