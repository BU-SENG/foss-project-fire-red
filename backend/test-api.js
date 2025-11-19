require("dotenv").config();
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api"; // keep http://

async function testAPI() {
  console.log("🚀 Starting API Tests...\n");

  try {
    // Test 1: Get all messages
    console.log("1. Testing GET /api/messages...");
    const messagesRes = await axios.get(`${BASE_URL}/messages`);
    console.log(`   ✅ Status: ${messagesRes.status}, Messages: ${messagesRes.data.length}\n`);

    // Test 2: Create a new message
    console.log("2. Testing POST /api/messages...");
    const createRes = await axios.post(`${BASE_URL}/messages`, {
      text: "Test message from API testing",
      category: "suggestion"
    });
    console.log(`   ✅ Status: ${createRes.status}, ID: ${createRes.data._id}\n`);

    const messageId = createRes.data._id;

    // Test 3: Like the message
    console.log("3. Testing POST /api/messages/:id/like...");
    const likeRes = await axios.post(`${BASE_URL}/messages/${messageId}/like`);
    console.log(`   ✅ Status: ${likeRes.status}, Likes: ${likeRes.data.likes}\n`);

    // Test 4: Admin login
    console.log("4. Testing POST /api/admin/login...");
    const loginRes = await axios.post(`${BASE_URL}/admin/login`, {
      email: "okaforizumo@gmail.com",
      password: process.env.ADMIN_PASSWORD // use .env for security
    });

    if (loginRes.status === 200) {
      console.log(`   ✅ Login successful, Token received\n`);
      const token = loginRes.data.token;

      // Test 5: Dashboard summary
      console.log("5. Testing GET /api/dashboard/summary...");
      const dashboardRes = await axios.get(`${BASE_URL}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token} `}
      });
      console.log(`   ✅ Status: ${dashboardRes.status}`);
      console.log(`   📊 Total: ${dashboardRes.data.total}, Unread: ${dashboardRes.data.unread}\n`);

      // Test 6: Update message status
      console.log("6. Testing PUT /api/messages/:id...");
      const updateRes = await axios.put(`${BASE_URL}/messages/${messageId}`, {
        status: "reviewed"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`   ✅ Status: ${updateRes.status}, New Status: ${updateRes.data.status}\n`);

    } else {
      console.log(`   ❌ Login failed: ${loginRes.data.message}\n`);
    }

    console.log("🎉 All basic tests completed!");

  } catch (error) {
    console.log("❌ Test failed:", error.message);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }
    console.log("\n💡 Make sure:");
    console.log("   - Your server is running on port 5000");
    console.log("   - MongoDB is connected");
    console.log("   - Admin credentials are correct in .env file");
  }
}

testAPI();