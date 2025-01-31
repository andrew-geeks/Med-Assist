import NavBar from "../navbar/navbar";
import Cookies from 'js-cookie';
import '../../styles/dashboard.css'

function Dashboard(){
    return(
        <div>
            <NavBar/>
            <h3 className="head">Welcome {Cookies.get('name')},</h3>
        </div>
    )
}

export default Dashboard;