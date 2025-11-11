import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink } from "./router";
import "./global.css";
import Dashboard from "./pages/Dashboard";
import Roster from "./pages/Roster";
import Assignments from "./pages/Assignments";
import Standards from "./pages/Standards";
import Groups from "./pages/Groups";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App(){
  return (
    <div className="app-shell">
      <header className="header">
        <div className="container">
          Synapse — Teacher Co-Pilot
          <nav className="nav" style={{marginTop:10}}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/roster">Roster</NavLink>
            <NavLink to="/assignments">Assignments</NavLink>
            <NavLink to="/standards">Standards</NavLink>
            <NavLink to="/groups">Groups</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <div style={{height:16}} />
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/roster" element={<Roster/>}/>
          <Route path="/assignments" element={<Assignments/>}/>
          <Route path="/standards" element={<Standards/>}/>
          <Route path="/groups" element={<Groups/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </main>
    </div>
  );
}

if (document.getElementById("root")) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </StrictMode>
  );
}
