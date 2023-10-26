import { Link } from "@/lib/client/router";

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
