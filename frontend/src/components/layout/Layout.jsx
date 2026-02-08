import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      {/* Navbar App.jsx me already hai */}

      <main
        id="app-scroll-container"
        className="pt-[74px] min-h-screen"
      >
        {children}
      </main>
    </>
  );
}
