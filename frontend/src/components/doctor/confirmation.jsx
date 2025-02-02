import '../../styles/doctor.css';
import logo from '../../media/main.png';
import {MailCheck,CalendarCheck2} from 'lucide-react';

const Confirmed = ()=>{
    return(
        <div className="confirm-div">
            <h5>MedAssist</h5><img src={logo} height="70" width="70" alt=""/>
            <h1 className="confirm-text">Your Booking has been confirmed <CalendarCheck2 size={50}/>!</h1>
            <em>Check your mail for booking details <MailCheck/>.</em><br/>
            <a href="/dashboard">Go to dashboard</a>
        </div>
    );
}

export default Confirmed;