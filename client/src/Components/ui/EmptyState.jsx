import "./EmptyState.css";

const EmptyState = ({ title = "Nothing here yet", subtitle = "" }) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default EmptyState;