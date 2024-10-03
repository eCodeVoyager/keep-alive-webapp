import App from "../App";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const RouterApp = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default RouterApp;
