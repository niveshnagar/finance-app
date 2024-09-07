import { Link } from "react-router-dom";

const BottomWarning = ({ text, buttonText, to }) => {
  return (
    <div className="flex justify-center py-2 text-sm">
      <div>{text}</div>
      <Link to={to} className="cursor-pointer underline pl-1">
        {buttonText}
      </Link>
    </div>
  );
};

export default BottomWarning;
