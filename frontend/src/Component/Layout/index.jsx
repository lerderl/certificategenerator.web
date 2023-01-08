import Navbar from "../Navbar";
import Footer from "../Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== "/login" && <Navbar />}
      {children}
      {pathname !== "/dashboard" || (pathname !== "login" && <Footer />)}
    </>
  );
};

export default Layout;
