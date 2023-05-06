import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Nav from "./Components/Nav";

const RootLayout = () => {
  return (
    <div className="root-layout">
      {
        <>
          <Nav />
          <Outlet />
        </>
      }
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          {/* <Route
            path="Social"
            element={user ? <Social /> : <Navigate to="/Login" />}
          />
          <Route
            path="Game"
            element={user ? <Game /> : <Navigate to="/Login" />}
          />
          <Route
            path="Character"
            element={user ? <Character /> : <Navigate to="/Login" />}
          />
          <Route
            path="Gacha"
            element={user ? <Gacha /> : <Navigate to="/Login" />}
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
