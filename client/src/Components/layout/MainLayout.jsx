import Navbar from "./Navbar";

const MainLayout = ({ children, isDark, setIsDark }) => {
  return (
    <>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <main style={{ paddingTop: "76px" }}>
        {children}
      </main>
    </>
  );
};

export default MainLayout;