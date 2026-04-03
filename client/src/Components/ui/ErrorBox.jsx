import "./ErrorBox.css";

const ErrorBox = ({ message = "Something went wrong." }) => {
  return (
    <div className="error-box">
      <p>{message}</p>
    </div>
  );
};

export default ErrorBox;