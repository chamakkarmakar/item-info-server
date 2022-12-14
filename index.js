const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g7iwftr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run () {
    try {
        await client.connect();
        const itemCollection = client.db('dbItemInfo').collection('items');
        const subCategoryCollection = client.db('dbItemInfo').collection('sub-category');
        const unitCollection = client.db('dbItemInfo').collection('unit-name');
        console.log('stock management database connected');

        // add items
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertMany(newItem);
            res.send(result);
        });

        // add sub
        app.post('/subcategory', async (req, res) => {
            const sub = req.body;
            const result = await subCategoryCollection.insertOne(sub);
            res.send(result);
        });

        // add unit
        app.post('/unit', async (req, res) => {
            const unit = req.body;
            const result = await unitCollection.insertOne(unit);
            res.send(result);
        });

        // modify
        app.put('/item/:id', async(req,res) =>{
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = {_id: ObjectId(id)};
            const update = {
                $set : {
                     itemType : updatedItem.type,
                     itemName : updatedItem.name,
                     subCategory : updatedItem.subCat,
                     unit : updatedItem.unitName,
                     stockLimit : updatedItem.stock
                }
            };
            const option = {upsert:true};
            const result = await itemCollection.updateOne(filter,update,option);
            res.send(result);
        })

        // load all data 
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // load single data
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        // load all sub 
        app.get('/subcategory', async (req, res) => {
            const query = {};
            const cursor = subCategoryCollection.find(query);
            const sub = await cursor.toArray();
            res.send(sub);
        });

        // load all unit
        app.get('/unit', async (req, res) => {
            const query = {};
            const cursor = unitCollection.find(query);
            const unit = await cursor.toArray();
            res.send(unit);
        });

        // Delete item
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);

        })
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