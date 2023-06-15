import { BrowserRouter, Routes, Route, Outlet, HashRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Nav from "./Components/Navigation";
import LoadingScreen from "./Components/LoadingScreen";
import { useEffect, useState } from "react";
// THIS FILE NEEDS TO BE RE DONE
const RootLayout = () => {
  // const [pageLoaded, setPageLoaded] = useState(false);

  // useEffect(() => {
  //   const onPageLoad = () => {
  //     setPageLoaded(true);
  //   };

  //   if (document.readyState === "complete") {
  //     onPageLoad();
  //   } else {
  //     window.addEventListener("load", onPageLoad);
  //     return () => window.removeEventListener("load", onPageLoad);
  //   }
  // }, []);

  return (
    <div className="root-layout">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
    // <Home />
  );
}

export default App;
