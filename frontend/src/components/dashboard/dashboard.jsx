import NavBar from "../navbar/navbar";
import Cookies from 'js-cookie';

function Dashboard(){
    return(
        <div>
            <NavBar/>
            <h3>Welcome {Cookies.get('name')},</h3>
        </div>
    )
}

export default Dashboard;