import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendedCategory = ({ searchTerms }) => {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const results = [];

            for (const term of searchTerms) {
                try {
                    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}`);
                    results.push(...(response.data.items || []));
                } catch (error) {
                    console.error(`Error fetching results for term '${term}':`, error);
                }
            }

            setSearchResults(results);
        };

        fetchData();
    }, [searchTerms]);

    return (
        <div>
            <ul>
                {searchResults.map((result) => (
                    <li key={result.id}>
                        <h3>{result.volumeInfo.title}</h3>
                        <img src={result.volumeInfo.imageLinks?.thumbnail} alt={result.volumeInfo.title} width={100} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecommendedCategory;