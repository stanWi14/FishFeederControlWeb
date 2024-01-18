import logo from './logo.svg';
import './App.css';
import ShowAllDevice from './Components/ShowAllDevice';
import CreateDevice from './Components/CreateDevice';
import DeviceCard from './Components/DeviceCard';
function App() {
  return (
    <div>
      <ShowAllDevice/>
      <CreateDevice/>
    </div>
  );
}

export default App;
