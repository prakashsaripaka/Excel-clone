import "./styles.css";
import Table from "./components/Table";
export default function App() {
  return (
    <div className="App">
      {/*style={{ width: "max-content" }} */}
      <div style={{ width: "max-content" }}>
        <Table />
      </div>
    </div>
  );
}
