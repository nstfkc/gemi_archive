type HomeData = {
  message: string;
};

const Home = (props: { data: HomeData }) => {
  const { message } = props.data;
  return <div>{message}</div>;
};

export default Home;
