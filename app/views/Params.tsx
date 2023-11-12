import { Link } from "@/lib/client/router";

interface ParamsData {
  params: any;
}

const Params = (props: { data: ParamsData }) => {
  return (
    <div>
      <div>Params View</div>
      <div>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Params;
