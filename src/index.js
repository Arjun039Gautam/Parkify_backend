import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { initializeSlots } from "./utils/initSlots.js";  // import your init function

dotenv.config({
    path: './env'
})

connectDB()
.then(async () => {
    // Initialize slots before server starts
    await initializeSlots();

    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port : ${process.env.PORT || 8000}`)
    })
})
.catch((err) => {
    console.log('MongoDB connection failed !!', err)
})
