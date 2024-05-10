import React, { useEffect } from "react";
import LiveSearch from "./pages/home/live_search";
import { Routes, Route } from "react-router-dom";

function App() {
  async function trafficTracker() {
    const body = {
      page: process.env.REACT_APP_PAGE,
      deltaTraffic: 1,
      deltaVisitor: 0,
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/traffic`,
      {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_ACCESS_CODE}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    if (process.env.REACT_APP_TRAFFIC_MODE === "prod") {
      trafficTracker();
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route exact path='/' element={<LiveSearch />} />
      </Routes>

    </div>
  );
}

export default App;
