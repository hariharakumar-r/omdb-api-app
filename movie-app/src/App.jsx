import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FcSpeaker } from 'react-icons/fc';
import './App.css'; // Assuming you have a CSS file for styling

function App() {
  const [searchWord, setSearchWord] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMeaning = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const result = await response.json();
      setData(result[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (data && data.phonetics && data.phonetics[0] && data.phonetics[0].audio) {
      new Audio(data.phonetics[0].audio).play();
    }
  };

  return (
    <div className="App">
      <h1>Free Dictionary</h1>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />
        <button
          onClick={() => {
            getMeaning();
          }}
        >
          <FaSearch size="20px" />
        </button>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="showResults">
          <h2>
            {data.word}{" "}
            <button
              onClick={() => {
                playAudio();
              }}
            >
              <FcSpeaker size="26px" />
            </button>
          </h2>
          <h4>Phonetic:</h4>
          <p>{data.phonetic}</p>
          <h4>Parts of speech:</h4>
          <p>{data.meanings[0].partOfSpeech}</p>
          <h4>Definition:</h4>
          <p>{data.meanings[0].definitions[0].definition}</p>
          <h4>Example:</h4>
          <p>{data.meanings[0].definitions[0].example}</p>
        </div>
      )}
    </div>
  );
}

export default App;
