import Navbar from "../Navbar";
import Footer from "../Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== "/dashboard" &&
        pathname !== "/login" &&
        pathname !== "/signup" && <Navbar />}
      {children}
      {pathname !== "/dashboard" &&
        pathname !== "/signup" &&
        pathname !== "/login" && <Footer />}
    </>
  );
};

export default Layout;
