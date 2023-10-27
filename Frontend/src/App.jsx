import { BroweserRouter, Route, Routes, useState } from "react";
import "./App.css";
import Layout from "./layout/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/" element={<About/>}></Route>
            <Route path="/" element={<Admin/>}></Route>
            <Route path="/" element={<CreateUser/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
