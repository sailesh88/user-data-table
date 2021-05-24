import { Header } from 'antd/lib/layout/layout';
import 'antd/dist/antd.css';
import './App.css';
import UserList from './pages/UserList';

function App() {
  return (
    <div className="App">
      <Header color="blue" className="App-Header">
        <span className="App-Title">TM2</span>
      </Header>

      <div className="App-content">
        <UserList />
      </div>
    </div>
  );
}

export default App;

