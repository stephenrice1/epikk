//This file is for seeding our database - if you run seedDB() it will delete all the data and replace it with random data from cities.js.

const mongoose = require('mongoose');
const cities = require('./cities');
const { firstnames, lastnames } = require('./seedHelpers');
const Whanau = require('../models/whanau');

mongoose.connect('mongodb://localhost:27017/epikk', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Whanau.deleteMany({});
    for (let i = 0; i < 350; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const fam = new Whanau({
            // my user id!
            author: '618aaa96fad43c5a7c08be2e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(lastnames)} ${sample(firstnames)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero soluta odit repudiandae maiores dolorum quia itaque ducimus. Laudantium, natus nisi repellendus illo, asperiores repudiandae facilis ut earum officiis in laboriosam.',
            contact: 'contact',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images:  [ 
                { 
                url : "https://res.cloudinary.com/epikk/image/upload/v1638138890/Epikk/kk58su6whw8k7wicigh5.jpg", 
                filename : "Epikk/kk58su6whw8k7wicigh5" 
                }, { 
                url : "https://res.cloudinary.com/epikk/image/upload/v1638138890/Epikk/j2ngmo79z43gtokltmbi.jpg", 
                filename : "Epikk/j2ngmo79z43gtokltmbi" 
                }, { 
                url : "https://res.cloudinary.com/epikk/image/upload/v1638138890/Epikk/xj1rlyfwnn22gf6kxmzc.jpg", 
                filename : "Epikk/xj1rlyfwnn22gf6kxmzc" 
                }, { 
                url : "https://res.cloudinary.com/epikk/image/upload/v1638138891/Epikk/cecy3r07jhnndzbt2nbk.jpg",
                filename : "Epikk/cecy3r07jhnndzbt2nbk" 
                } ]
        })
        await fam.save();
    }
}

seedDB().then(() => {
    console.log("database seeded!!!")
    mongoose.connection.close()
});