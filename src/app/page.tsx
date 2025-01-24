import ThreeScene from "./components/ThreeScene";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="w-[500px] h-[500px] flex items-center justify-center">
        <ThreeScene />
      </div>
    </div>
  );
}
