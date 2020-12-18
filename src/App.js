import logo from './logo.svg';
import './App.css';
import {  Login} from './Containers/login';
import {ContainerMain} from './Components/Container';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/containers" component={ContainerMain} />
          <Route exact path="/" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
