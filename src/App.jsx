import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Pages/Home/Home";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
