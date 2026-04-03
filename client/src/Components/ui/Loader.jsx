import "./Loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;