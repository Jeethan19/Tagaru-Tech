import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="app">
      <h1>Counter App</h1>
      <p>Current count: {count}</p>
      <button 
        onClick={incrementCount}
        aria-label="Increment counter"
      >
        Click to increment ({count})
      </button>
    </div>
  );
}

export default App;