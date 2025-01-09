import LandingNavBar from './landnavbar';
import '../styles/common.css';
//import Button from 'react-bootstrap/Button';
import Chest from '../media/chest.jpg';
import { ReactTyped } from "react-typed";
import {BrainCircuit,IndianRupee,LockKeyhole} from 'lucide-react';

function Home(){
   
    

    return(
        <div>
            <LandingNavBar/>
            <div className="p1">
                <div className="text">
                    <h3>AI for Modern</h3>
                    <h3>Health Care</h3>
                </div>
                <img src={Chest} className="chest" height="300" alt=""/>
            </div>
            <div className="p2">
                <div className="typed">
                    <ReactTyped
                    strings={[
                        "Analyze Chest X-RAY",
                        "Summarize Medical Reports",
                        "ChatBot for Medical Queries",
                        "Book Doctor Appointments"
                    ]}
                    typeSpeed={70}
                    backSpeed={20} 
                    backDelay={1500} 
                    loop
                    />
                </div>
            </div>
            <div className="p3">
                <div class="feature-container">
                    <div class="box">
                        <BrainCircuit size={50}/>
                        <p>Powered by LLMs</p>
                    </div>
                    <div class="box">
                        <IndianRupee size={50}/>
                        <p>Free Of Cost</p>
                    </div>
                    <div class="box">
                        <LockKeyhole size={50} />
                        <p>Highly Secured</p>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Home;