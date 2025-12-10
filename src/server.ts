import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js';


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI as string);


    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}`)
    })
}