import React from 'react';
import ProductList from './components/ProductList';
import ChatAssistant from './components/ChatAssistant';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Elara E-Commerce</h1>
          <p className="text-gray-600 mt-2">AI-Powered Shopping Experience</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <ProductList />
      </main>
      <ChatAssistant />
    </div>
  );
}

export default App;
