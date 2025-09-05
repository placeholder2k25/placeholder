import React from "react";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Campaign Management</h1>
      <CampaignForm />
      <hr style={{ margin: "20px 0" }} />
      <CampaignList />
    </div>
  );
}

export default App;
