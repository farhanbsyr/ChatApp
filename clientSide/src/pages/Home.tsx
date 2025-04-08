import SidebarCos from "../components/SidebarCos";
import Content from "../components/Content";

const Home = () => {
  return (
    <div className="flex flex-row h-full py-2 mb-2 bg-stone-950">
      <div className="h-full">
        <SidebarCos />
      </div>
      <div className="w-full h-full bg-white rounded-3xl ">
        <Content />
      </div>
    </div>
  );
};

export default Home;
