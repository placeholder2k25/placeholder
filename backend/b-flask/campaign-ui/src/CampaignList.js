import React, { useEffect, useState } from "react";
import axios from "axios";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>All Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul>
          {campaigns.map((c) => (
            <li key={c.id} style={{ marginBottom: "15px" }}>
              <strong>{c.campaign_name}</strong> - {c.objective} <br />
              <em>Budget: {c.budget_target}</em> <br />
              <small>Timeline: {c.timeline}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampaignList;
