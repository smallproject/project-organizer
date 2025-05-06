// import express from "express";
// import axios from "axios";
// import cors from "cors";

const express = require("express");
const axios = require("axios");/**/
const app = express();
const PORT = process.env.PORT || 5052;

const cors = require("cors");
app.use(cors());

const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAASN0AEAAAAAMHlN%2F8Mcv%2F8xYFyqeP3jQ4lWxkc%3DfKDS4Bacc1V8Zs152hl2JSqLjCQvhrNQYHaDT4ov9Dm83feVhY";
const USER_ID = "1720359275644547072";

console.log("testing local server");

// ✅ Test Route (Check if server is running)
app.get("/", (req, res) => {
    res.send("Server is running!");
    console.log("Server is running!");
});

// ✅ Twitter Route (Check if server is running)
// always gets a 429 issue,You're Hitting Twitter’s Rate Limit (429 Too Many Requests) 🚨
app.get("/get-tweets", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=15`,
            {
                headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
            }
        );

        console.log("API Response:", response.data);

        if (!response.data || !response.data.data) {
            return res.status(404).json({ error: "No tweets found" });
        }

        const tweetIds = response.data.data.map((tweet) => tweet.id);
        res.json(tweetIds);
    } catch (error) {
        res.status(500).send("Error fetching tweets");
        console.error("Error fetching tweets:", error.response ? error.response.data : error.message);
    }
});


// this is cached version
// const redis = require("redis");
// const client = redis.createClient();
//
// app.get("/get-tweets", async (req, res) => {
//     client.get("cachedTweets", async (err, cachedData) => {
//         if (cachedData) {
//             return res.json(JSON.parse(cachedData)); // Serve cached response
//         }
//
//         try {
//             const response = await axios.get(
//                 `https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=5`,
//                 { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
//             );
//
//             const tweetIds = response.data.data.map((tweet) => tweet.id);
//             client.setex("cachedTweets", 300, JSON.stringify(tweetIds)); // Cache for 5 min
//
//             res.json(tweetIds);
//         } catch (error) {
//             res.status(500).send("Error fetching tweets");
//         }
//     });
// });



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
