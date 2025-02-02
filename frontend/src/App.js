import {BrowserRouter as Router, Route, Routes,Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';


//components
import Home from './components/home';
import Login from './components/authentication/login';
import Signup from './components/authentication/signup';
import ForgotPass from './components/authentication/forgotpass';
import Dashboard from './components/dashboard/dashboard';
import DocDashboard from './components/dashboard/ddashboard';
import DSignup from './components/authentication/dsignup';
import Chat from './components/chat';
import Xray from './components/xray';
import Summarize from './components/summarize';
import DoctorAppointment from './components/doctor/appointment';
import Confirmed from './components/doctor/confirmation';
import EditProfile from './components/doctor/editProfile';


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

//private routing -- doctor
export const PrivateDoctorRoute = ({ children}) => {
  const loggedIn = Cookies.get("type");
      
  if (loggedIn !== undefined && loggedIn==='doctor') {
    return children
  }
  else{
    return <Navigate to="/login" />
  }
}

//private routing -- authenticated
export const PrivateAuthedRoute = ({ children}) => {
  const loggedIn = Cookies.get("type");
  if (loggedIn === undefined) {
    return children
  }
  else{
    if(loggedIn==='patient'){
      return <Navigate to="/dashboard" />
    }
    else{
      return <Navigate to="/ddashboard" /> //doctor
    } 
  }
}






//base code
function App() {
  return (
    <div>
        <Router>
          <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<PrivateAuthedRoute><Login/></PrivateAuthedRoute>}/>
              <Route path='/signup' element={<PrivateAuthedRoute><Signup/></PrivateAuthedRoute>}/>
              <Route path='/dsignup' element={<PrivateAuthedRoute><DSignup/></PrivateAuthedRoute>}/>
              <Route path='/forgotpassword' element={<PrivateAuthedRoute><ForgotPass/></PrivateAuthedRoute>}/>
              <Route path='/dashboard' element={<PrivatePatientRoute><Dashboard/></PrivatePatientRoute>}/>
              <Route path='/appointment/:id' element={<PrivatePatientRoute><DoctorAppointment/></PrivatePatientRoute>}/>
              <Route path='/confirm' element={<PrivatePatientRoute><Confirmed/></PrivatePatientRoute>}/>
              <Route path='/ddashboard' element={<PrivateDoctorRoute><DocDashboard/></PrivateDoctorRoute>}/>
              <Route path='/editprofile' element={<PrivateDoctorRoute><EditProfile/></PrivateDoctorRoute>}/>
              <Route path="/chat" element={<Chat/>}/>
              <Route path="/xray" element={<Xray/>}/>
              <Route path="/summarize" element={<Summarize/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
