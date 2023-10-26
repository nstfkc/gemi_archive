import { Link } from "react-router-dom";

type AboutData = {
  message: string;
};

const About = () => {
  return (
    <div>
      <div>About page</div>
      <div>
        <Link to="/">Home Route</Link>
      </div>
    </div>
  );
};

export default About;
