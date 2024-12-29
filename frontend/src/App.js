import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

//components
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';



//base code
function App() {
  return (
    <div>
        <Router>
          <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
