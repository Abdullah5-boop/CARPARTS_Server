const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const stripe = require("stripe")('sk_test_51L32NxLceKxAIYC5qBd3GeS6sMporo68HMcOamuDpcd5qYTfCKQY7TI8z4MHf7vfPvr8rvA4oNUvG7gP1UUVGfdj001BGFaaY1');
const stripe = require('stripe')('sk_test_51L32NxLceKxAIYC5qBd3GeS6sMporo68HMcOamuDpcd5qYTfCKQY7TI8z4MHf7vfPvr8rvA4oNUvG7gP1UUVGfdj001BGFaaY1');
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Pass}@cluster0.q4ve3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
         client.connect()
        const FirebaseUserCollection = client.db('FinalProject').collection('FirebaseUserCollection')
        const FirebaseloginStorageCollection = client.db('FinalProject').collection('FirebaseloginStorage')
        const ServiceCollection = client.db('FinalProject').collection('Service')
        const OrderCollection = client.db('FinalProject').collection('OrderList')
        const ReviewListCollection = client.db('FinalProject').collection('ReviewList')



        app.put('/register', async (req, res) => {
            const email = req.body.email;
            const type = req.body.type;
            console.log("this is register",email)
            const filter = { email }
            const option = { upsert: true }
            const updatedoc = {
                $set: {
                    email: email,
                    type: type
                }
            }
            const result = await FirebaseUserCollection.updateOne(filter, updatedoc, option)

            res.send(result)
        })
        app.put('/registerstorage', async (req, res) => {
            const email = req.body.email;
            const type = req.body.type;
            console.log("this is registerstorage",email)
            // const filter = { email }
            // const option = { upsert: true }
            // const updatedoc = {
            //     $set: {
            //         email: email,
            //         // type: type
            //     }
            // }
            // const result = await FirebaseloginStorageCollection.updateOne(filter, updatedoc,option)


            const querry = { email }
            const cousor = FirebaseloginStorageCollection.find(querry)
            const result = await cousor.toArray();
            if (result[0]?.email) {
                console.log({ success: true })
                res.send({ success: true })
            }
            else {
                console.log({ success: false })
                res.send({ success: false })
            }
            console.log("/registerstorage", result.email)
        })
        app.put('/postregisterstorage', async (req, res) => {

            const email = req.body.email;
            const type = req.body.type;
            console.log("this is registerstrage put",email)
            const filter = { email }
            const option = { upsert: true }
            const updatedoc = {
                $set: {
                    email: email,
                    type: type
                }
            }
            const result = await FirebaseloginStorageCollection.updateOne(filter, updatedoc, option)
            res.send(result)

        })

        app.patch('/ordersupdate', async (req, res) => {

            const data = req?.body;
            const id = data.id
            const paid = data.paid
            const email = data.email;
            const filter = { _id: ObjectId(id), email }
            const updatedDoc = {
                $set: {

                    paid: paid,
                }
            }
            const updatedBooking = await OrderCollection.updateOne(filter, updatedDoc);
            res.send(updatedBooking)

        })


        app.patch('/alluser', async (req, res) => {
            const id = req?.body?._id
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    type: "admin"
                }
            }
            const updateamin = await FirebaseloginStorageCollection.updateOne(filter, updatedDoc)
            res.send(updateamin)

        })
        app.get('/alluser', async (req, res) => {
            const querry = {}
            const cousor = FirebaseloginStorageCollection.find(querry)
            const result = await cousor.toArray()

            res.send(result)
        })
        app.get('/alluser/:email', async (req, res) => {
            const email = req.params.email
            console.log("dashbord ", email)
            const querry = { email }
            const cousor = FirebaseloginStorageCollection.find(querry)
            const result = await cousor.toArray()

            res.send(result)
        })

        app.put('/review', async (req, res) => {
            const data = req.body
            const email = data.email;
            const content = data.review;
            const ProductName = data.productName;
            const id = data.id;
            const option = { upsert: true }
            const filter = { email, ProductName }
            console.log(ProductName)
            const updatedoc = {
                $set: {
                    email: email,
                    content: content,
                    ProductName: ProductName
                }
            }
            const result = await ReviewListCollection.updateOne(filter, updatedoc, option)

            res.send(result)
        })
        app.get('/review/:email', async (req, res) => {
            const email = req.params.email
            console.log("review ",email)
            const querry = { email }
            const cursor = ReviewListCollection.find(querry)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/addpost', async (req, res) => {
            const data = req.body
            const result = await ServiceCollection.insertOne(data)
            console.log(result)
            res.send(result)

        })


        app.put('/order', async (req, res) => {
            const email = req.body.UserEmail;
            const quantity = req.body.quantity
            const Location = req.body.Location
            const Engine = req.body.Engine
            const paid = req.body.paid
            const price = req.body.price
            const img = req.body.img
            // console.log(Location, email, quantity)

            const filter = { email, Engine }
            const option = { upsert: true }
            const updatedoc = {
                $set: {
                    email: email,
                    quantity: quantity,
                    Location: Location,
                    Engine: Engine,
                    paid: paid,
                    price: price,
                    img: img
                }
            }
            const result = await OrderCollection.updateOne(filter, updatedoc, option)
            res.send(result)
        })

        app.get('/order', async (req, res) => {
            const querry = {}
            const cursor = OrderCollection.find(querry)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.put('/shift/:_id', async (req, res) => {
            const id = req.params._id
            
            const filter = { _id:ObjectId(id) }
            const option={upsert:true}
            const updatedoc = {
                $set: {
                    shift:true
                }
            }
            const result= await OrderCollection.updateOne(filter,updatedoc,option)
            console.log(result)
            res.send(result)
        })
        app.get('/AllShift',async(req,res)=>{
            const querry ={shift:true}
            const cursor= OrderCollection.find(querry)
            const result= await cursor.toArray()
            res.send(result)
        })
        app.get('/product', async (req, res) => {
            const querry = {}
            const cursor = ServiceCollection.find(querry)
            const result = await cursor.toArray()
            res.send(result)
            // console.log(result)

        })

        app.patch('/updatedetails', async (req, res) => {
            const data = req.body
            const email = data.email;
            const img = data.img;
            const Slink = data.Slink;
            //    console.log(email,img,Slink)

            const filter = { email }
            const updatedoc = {
                $set: {
                    img: img,
                    Slink: Slink
                }
            }
            const result = await FirebaseUserCollection.updateOne(filter, updatedoc)
            console.log(result)
            res.send(result)

        })



        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email
            // console.log(email)
            // res.send("connected")
            const querry = { email }
            const cursor = OrderCollection.find(querry)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/profile/:email', async (req, res) => {
            const email = req.params.email
            console.log("profile",email)
            // res.send("connected")
            const querry = { email }
            const cursor = FirebaseUserCollection.find(querry)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/payment/:email/:id', async (req, res) => {

            const email = req.params.email
            const id = req.params.id
            const querry = { _id: ObjectId(id), email };
            const coursor = OrderCollection.find(querry)
            const result = await coursor.toArray()
            // console.log(result)
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: ObjectId(id) }
            const result = await OrderCollection.deleteOne(filter)
            console.log(result)
            res.send(result)
        })








        app.post('/create-payment-intent', async (req, res) => {
            const service = req?.body;
            const price = service?.mainprice;

            if (price !== null) {

                const paymentIntent = await stripe?.paymentIntents.create({
                    amount: 100,
                    currency: 'usd',
                    payment_method_types: ['card'],
                });
                res.send({ clientSecret: paymentIntent?.client_secret })
                console.log({ clientSecret: paymentIntent?.client_secret })
                console.log(price)
            }
            // else{
            //     console.log("fail")
            //     res.send({status:"fail"})
            // }



            // // }
            //    const paymentIntent = await stripe?.paymentIntents.create({
            //         amount: 1000,
            //         currency: 'usd',
            //         payment_method_types: ['card'],
            //     });
            //     res.send({ clientSecret: paymentIntent?.client_secret })
            //     console.log({ clientSecret: paymentIntent?.client_secret })


        })



    }
    finally { }


}
run().catch(console.dir)











app.get('/', (req, res) => {
    res.send("project is running")
})
app.listen(port, () => {
    console.log("project running on ", port)
})
