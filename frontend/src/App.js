import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

//components
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import DSignup from './components/dsignup';
import Chat from './components/chat';
import Xray from './components/xray';



//base code
function App() {
  return (
    <div>
        <Router>
          <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/dsignup' element={<DSignup/>}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path="/chat" element={<Chat/>}/>
              <Route path="/xray" element={<Xray/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
