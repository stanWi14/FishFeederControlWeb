import logo from './logo.svg';
import './App.css';
import ShowAllDevice from './Components/ShowAllDevice';
import CreateDevice from './Components/CreateDevice';
import DeviceCard from './Components/DeviceCard';
import NavBar from './Components/NavBar';
import WelcomePage from './Components/Welcome';

function App() {
  return (
    <div>
      <NavBar/>
      <WelcomePage/>
      <ShowAllDevice/>
      <CreateDevice/>
    </div>
  );
}

export default App;
