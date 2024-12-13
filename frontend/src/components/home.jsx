import NavBar from "./navbar";
import Button from 'react-bootstrap/Button';

function Home(){

    return(
        <div>
            <NavBar/>
            <h1>This is Home</h1>
            <Button variant="secondary">Primary Button</Button>
        </div>
        
    )
}

export default Home;