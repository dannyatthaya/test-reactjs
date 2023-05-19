import { useNavigate } from 'react-router-dom';
import '@/assets/scss/App.css'

function App() {
  // const [count, setCount] = useState(0)
  const navigate = useNavigate();

  return (
    <>
      <div id='landingPage'>
        <h1>Mini Project with Laravel + React</h1>
        <div className="card">
          {/* <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button> */}
          <button onClick={() => navigate('/dashboard/metric')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </>
  )
}

export default App
