import NavBar from "../navbar/navbar";
import Cookie from 'js-cookie'
//Doctor-dashboard
function DocDashboard(){
    
    return(
        <div>
            <NavBar/>
            <div>
                <h3>Doctor's Dashboard</h3>
                <h5>Welcome {Cookie.get('name')}</h5>
            </div>
        </div>
    )
}


export default DocDashboard;