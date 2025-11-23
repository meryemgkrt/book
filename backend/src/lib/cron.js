import cron from "cron";
import http from "http";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function() { // ✅ 14 dakikada bir (ücretsiz plan için ideal)
    const url = process.env.API_URL || process.env.RENDER_EXTERNAL_URL;
    
    if (!url) {
        console.error("❌ API_URL not set in environment variables");
        return;
    }
    
    console.log(`🔄 Pinging ${url} to keep server awake...`);
    
    const client = url.startsWith("https") ? https : http;
    
    client.get(url, (res) => {
        if (res.statusCode === 200) {
            console.log("✅ Server pinged successfully. Status: 200");
        } else {
            console.log(`⚠️ Server responded with status: ${res.statusCode}`);
        }
    }).on("error", (e) => {
        console.error("❌ Ping error:", e.message);
    });
});

export default job;