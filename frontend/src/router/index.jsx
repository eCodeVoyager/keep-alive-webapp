import App from "../App";
import {  Route, Routes } from "react-router-dom";
import ScrollToTop from "../components/Shared/ScrollToTop";

const RouterApp = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </>
  );
};
export default RouterApp;
