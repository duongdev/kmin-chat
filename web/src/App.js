import React from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RoomEntry from "./components/RoomEntry";
import Room from "./components/Room";

function App() {
  return (
    <div>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" exact component={RoomEntry} />
          <Route path="/room/:roomId" component={Room} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
