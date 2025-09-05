from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime, UTC
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://placeholder0812:helloworld@placeholder-dev.6tpphha.mongodb.net/?retryWrites=true&w=majority&appName=Placeholder-dev"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = (
    "mongodb+srv://placeholder0812:helloworld"
    "@placeholder-dev.6tpphha.mongodb.net/Placeholder"
    "?retryWrites=true&w=majority&appName=Placeholder-dev"
)

mongo = PyMongo(app)

# collections
users = mongo.db.users
campaigns = mongo.db.campaigns

# Utility: serialize MongoDB doc to JSON
def serialize_campaign(c):
    return {
        "id": str(c["_id"]),
        "brand_id": str(c.get("brand_id")) if c.get("brand_id") else None,
        "campaign_name": c.get("campaign_name"),
        "description": c.get("description"),
        "objective": c.get("objective"),
        "image": c.get("image"),
        "deliverables": c.get("deliverables"),
        "timeline": c.get("timeline"),
        "budget_target": c.get("budget_target"),
        "rules": c.get("rules"),
        "sample_captions": c.get("sample_captions"),
        "required_hashtags": c.get("required_hashtags"),
        "creator_approval": c.get("creator_approval"),
        "total_allowed_creators": c.get("total_allowed_creators"),
        "target": c.get("target"),
        "max_payment_per_creator": c.get("max_payment_per_creator"),
        "created_at": c.get("created_at"),
        "updated_at": c.get("updated_at"),
    }

@app.route("/campaigns", methods=["POST"])
def create_campaign():
    data = request.json
    brand_id = data.get("brand_id")

    # validate brand exists
    brand = users.find_one({"_id": ObjectId(brand_id), "role": "brand"})
    if not brand:
        return jsonify({"error": "Invalid brand_id or user is not a brand"}), 400

    campaign = {
        "brand_id": ObjectId(brand_id),
        "campaign_name": data.get("campaign_name"),
        "description": data.get("description"),
        "objective": data.get("objective"),
        "image": data.get("image"),
        "deliverables": data.get("deliverables"),
        "timeline": data.get("timeline"),
        "budget_target": data.get("budget_target"),
        "rules": data.get("rules"),
        "sample_captions": data.get("sample_captions"),
        "required_hashtags": data.get("required_hashtags"),
        "creator_approval": data.get("creator_approval", False),
        "total_allowed_creators": data.get("total_allowed_creators", 0),
        "target": data.get("target"),
        "max_payment_per_creator": data.get("max_payment_per_creator", 0),
        "created_at": datetime.now(UTC).isoformat(),
        "updated_at": datetime.now(UTC).isoformat(),
    }
    result = campaigns.insert_one(campaign)
    return jsonify({"id": str(result.inserted_id)}), 201

@app.route("/campaigns", methods=["GET"])
def get_campaigns():
    brand_id = request.args.get("brand_id")  # brand must send their id in query
    query = {}
    if brand_id:
        query["brand_id"] = ObjectId(brand_id)

    all_campaigns = campaigns.find(query)
    return jsonify([serialize_campaign(c) for c in all_campaigns])

@app.route("/campaigns/<id>", methods=["GET"])
def get_campaign(id):
    campaign = campaigns.find_one({"_id": ObjectId(id)})
    if not campaign:
        return jsonify({"error": "Campaign not found"}), 404
    return jsonify(serialize_campaign(campaign))

@app.route("/campaigns/<id>", methods=["PUT"])
def update_campaign(id):
    data = request.json
    data["updated_at"] = datetime.now(UTC).isoformat()
    result = campaigns.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Campaign not found"}), 404
    return jsonify({"message": "Campaign updated"})

@app.route("/campaigns/<id>", methods=["DELETE"])
def delete_campaign(id):
    result = campaigns.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Campaign not found"}), 404
    return jsonify({"message": "Campaign deleted"})

if __name__ == "__main__":
    app.run(debug=True)
