import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";

import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Services from "./components/pages/Services";
import Contact from "./components/pages/contact";
import Blog from "./components/pages/blog";
import Portfolio from "./components/pages/Portfolio";
import SimpleAdminPanel from "./components/admin/SimpleAdminPanel";
import NewAdminPanel from "./components/admin/NewAdminPanel"; // ✅ YEH IMPORT ADD KIYA
import AdminLogin from "./components/admin/AdminLogin";
import ForgotPassword from "./components/admin/ForgotPassword";

import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* WEBSITE ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />

          {/* ADMIN AUTH ROUTES */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* ADMIN PANELS */}
          <Route path="/simple-admin" element={<SimpleAdminPanel />} />
          
          {/* ✅ YEH NEW ADMIN ROUTE ADD KIYA - /admin PE KHULEGA */}
          <Route path="/admin" element={<NewAdminPanel />} />
          
          {/* ✅ ALTERNATIVE ROUTE - AGAR /new-admin PE BHI KHOLNA HAI */}
          <Route path="/new-admin" element={<NewAdminPanel />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;