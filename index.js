const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g7iwftr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run () {
    try {
        await client.connect();
        const itemCollection = client.db('dbItemInfo').collection('items');
        console.log('stock management database connected');

        // add items
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });

        // load all data 
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });
    }
    finally {

    }
}
run().catch(console.dir);

// Root API
app.get('/',(req,res) => {
    res.send('item info server');
});

// Listening to port 
app.listen(port, () => {
    console.log(port);
})