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
    <>
      Strona główna
    </>
  )
}

export default App
