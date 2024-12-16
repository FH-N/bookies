import React from 'react';
import RecommendedCategory from './RecommendedCategory';

const App = () => {
    const searchTerms = ['Science Fiction', 'History', 'Romance'];

    return (
        <div>
            <h1>Book Search App</h1>
            <RecommendedCategory searchTerms={searchTerms} />
        </div>
    );
};

export default App;