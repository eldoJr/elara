import React from 'react';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Elara E-Commerce</h1>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
}

export default App;
