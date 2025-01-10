import {BrowserRouter as Router, Route, Routes,Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';


//components
import Home from './components/home';
import Login from './components/authentication/login';
import Signup from './components/authentication/signup';
import Dashboard from './components/dashboard';
import DSignup from './components/authentication/dsignup';
import Chat from './components/chat';
import Xray from './components/xray';
import Summarize from './components/summarize';


//private routing -- patient
export const PrivatePatientRoute = ({ children}) => {
  const loggedIn = Cookies.get("type");
      
  if (loggedIn !== undefined && loggedIn==='patient') {
    return children
  }
  else{
    return <Navigate to="/login" />
  }

}





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
              <Route path='/dashboard' element={<PrivatePatientRoute><Dashboard/></PrivatePatientRoute>}/>
              <Route path="/chat" element={<Chat/>}/>
              <Route path="/xray" element={<Xray/>}/>
              <Route path="/summarize" element={<Summarize/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
