import axios from 'axios';
import { useState, useEffect } from 'react'


function App() {
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:8080/api');
    const data = response.data.owoce;
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-blue-500 text-red text-center p-4">
      <h1 className="text-4xl font-bold">Jeśli widzisz ten styl, Tailwind działa!</h1>
    </div>
  );
}

export default App
