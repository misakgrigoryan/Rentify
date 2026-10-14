import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// Layout wraps every page with the navbar and footer.
// <Outlet /> is where the current page appears.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
