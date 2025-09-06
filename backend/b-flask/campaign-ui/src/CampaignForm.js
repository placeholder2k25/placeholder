import React, { useState } from "react";
import axios from "axios";

const CampaignForm = () => {
  const [formData, setFormData] = useState({
    campaign_name: "",
    description: "",
    objective: "",
    image: "",
    deliverables: "",
    timeline: "",
    budget_target: "",
    rules: "",
    sample_captions: "",
    required_hashtags: "",
    creator_approval: false,
    total_allowed_creators: "",
    target: "",
    max_payment_per_creator: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/campaigns", formData);
      alert("Campaign created successfully!");
      setFormData({
        campaign_name: "",
        description: "",
        objective: "",
        image: "",
        deliverables: "",
        timeline: "",
        budget_target: "",
        rules: "",
        sample_captions: "",
        required_hashtags: "",
        creator_approval: false,
        total_allowed_creators: "",
        target: "",
        max_payment_per_creator: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create campaign.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create Campaign</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              {key.replace(/_/g, " ")}
            </label>
            {key === "creator_approval" ? (
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleChange}
              />
            ) : (
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            )}
          </div>
        ))}
        <button type="submit" style={{ padding: "10px 20px" }}>
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
