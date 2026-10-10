import Spinner from "./Spinner";

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <Spinner message="Loading page..." />
    </div>
  );
}

export default PageLoader;
