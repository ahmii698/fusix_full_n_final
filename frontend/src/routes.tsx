import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminTables from "./components/pages/admintables";
import AdminPanel from "./components/pages/AdminPanel";

export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

<Route path="/admin" element={<AdminPanel />} />
      </Routes>

    </BrowserRouter>

  );

}