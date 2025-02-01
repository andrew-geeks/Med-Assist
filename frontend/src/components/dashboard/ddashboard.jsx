import NavBar from "../navbar/navbar";
import Cookie from 'js-cookie'
import '../../styles/dashboard.css'
//Doctor-dashboard
function DocDashboard(){
    //console.log(Cookie.get("id"))
    return(
        <>
            <NavBar/>
            <div>
                <h5 className="head">Welcome Dr. {Cookie.get('name')},</h5>
            </div>
            <div class="info-container">
                <div class="box"><h5>Upcoming Appointments</h5><br/><h5 className="box-val">0</h5></div>
                <div class="box"><h5>Consultation Earnings(this month)</h5><br/><h5 className="box-val">₹0</h5></div>
                <div class="box"><h5>Patients Consulted<br/>(this month)</h5><br/><h5 className="box-val">0</h5></div>
            </div>
        </>
    )
}


export default DocDashboard;