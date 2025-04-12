import Header from "../header";
import Footer from "../footer";

export default function Layout({ children }) {
  return (
    <>
      <div className="relative">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300 shadow-sm">
          <Header />
        </div>


        {/* Content with padding to accommodate the fixed header */}
        <div className="pt-14">
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
