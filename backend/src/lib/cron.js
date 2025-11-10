import cron from "cron"
import https from "https"

const job=new cron.CronJob("*/14 * * * *",function(){
    https.get(process.env.API_URL, (res)=>{
        if(res.statusCode===200)console.log("Get request sent successfully to keep the server awake.")
        else console.log("Failed to send get request to keep the server awake.")

        .on("error",(e)=>console.error("Error while sending get request:",e))
    })
})

export default job