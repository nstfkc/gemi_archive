import { Link } from "@/lib/client/router";

interface AboutData {
  message: string;
}

const About = (props: { data: AboutData }) => {
  return (
    <div>
      <div className="text-red-400">{props.data.message}</div>
      <div>
        <Link to="/">Home Route</Link>
      </div>
    </div>
  );
};

export default About;
