import mongoose from 'mongoose'
import app from './index.js';


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI as string);


    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}`)
    })
}