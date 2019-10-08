// Importing Dependencies
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing Components
import Order from "./pages/Order";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import Testing from "./pages/Testing";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/order" component={Order} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/testing" component={Testing} />
          <Route component={Landing} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
