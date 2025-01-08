import React, { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import './styles/styles.scss';
import Header from './components/Header';

const App: React.FC = () => {

  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <div className="app">
      <Header onSearchQueryChange={handleSearchQueryChange} />
      <KanbanBoard searchQuery={searchQuery} />
    </div>
  );
};

export default App;