import App from "../App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "../components/Shared/ScrollToTop";

const RouterApp = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default RouterApp;
