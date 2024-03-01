import logo from './logo.svg';
import './App.css';
import ShowAllDevice from './Components/ShowAllDevice';
import CreateDevice from './Components/CreateDevice';
import DeviceCard from './Components/DeviceCard';
import NavBar from './Components/NavBar';
import WelcomePage from './Components/Welcome';
import AboutUs from './Components/AboutUs';
import Documentation from './Components/Documentation';



function App() {
  return (
    <div>
      <NavBar/>
      <WelcomePage/>
      <CreateDevice/>
      <ShowAllDevice/>
      <Documentation/>
      <AboutUs/>
    </div>
  );
}

export default App;
