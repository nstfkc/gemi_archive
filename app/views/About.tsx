import { Link } from "react-router-dom";

type AboutData = {
  message: string;
};

const About = () => {
  return (
    <div>
      <div>About page x</div>
      <div>
        <Link to="/">Home Route</Link>
      </div>
    </div>
  );
};

export default About;
