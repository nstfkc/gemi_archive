import { Link } from "@/lib/client/router";

type AboutData = {
  message: string;
};

const About = (props: { data: AboutData }) => {
  return (
    <div>
      <div>{props.data.message}</div>
      <div>
        <Link to="/">Home Route</Link>
      </div>
    </div>
  );
};

export default About;
