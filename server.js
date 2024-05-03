// CommonJs
/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const cors = require('@fastify/cors');
const fastify = require('fastify')({
  logger: true
})

//
fastify.register(cors, { 
  origin: true/* (origin, cb) => {
    const hostname = new URL(origin).hostname
    console.log(hostname)
    if(hostname === "localhost"){
      console.log("igual--------------------")
      //  Request from localhost will pass
      cb(null, true)
      return
    }
    console.log("nao--------------------")
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false)
    //cb(null, true)
  } */
})

//
//fastify.register(require('./our-db-connector'))


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb+srv://sabrina:1234@cluster0.mjknqep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    }
);
//
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})
/* async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir); */
//
//GETALL
fastify.get('/usuarios', async (request, reply) => {
  console.log("nyoho")
  const result = await client.db("Meu_pedido").collection("usuarios").find().toArray()
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
//GETALL RESTAURANTE
fastify.get('/restaurantes', async (request, reply) => {
  console.log("nyoho")
  console.log(request.params.restId)
  const restFiltro = request.params.restId;
  const pipeline = [
    { $match: { tipo: "restaurante" } },
    { $project: { email: 1, nome: 1, _id: 0 } },
    { $addFields: {"label": "$email" } }
    ]
  const result = await client.db("Meu_pedido").collection("usuarios").aggregate(pipeline).toArray()
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
//GETONE
fastify.get('/usuarios/:id', async (request, reply) => {
  console.log(request.params)
  const id = request.params.id
  console.log(id)
  const result = await client.db("Meu_pedido").collection("usuarios").findOne(
    {_id: new ObjectId(id)}
  )
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})

//CADASTRO
fastify.post('/usuarios', async (request, reply) => {
  console.log("****************")
  console.log(request.body)

  const result = await client.db("Meu_pedido").collection("usuarios").insertOne(
    request.body.usuario
  )
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
//LOGIN - TO DO schema
fastify.post('/login', async (request, reply) => {
  console.log("****************")
  const {email, senha} = request.body.login
  console.log(email,senha)
  console.log("===============")
  const result = await client.db("Meu_pedido").collection("usuarios").findOne(
    {
      email: "goldenteeth@email.com",
      senha: "nyoho"
    }
  )
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
//GETALL PRODUTO
fastify.get('/produtos', async (request, reply) => {
  const result = await client.db("Meu_pedido").collection("produtos").find().toArray()
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
//CADASTRO PRODUTO
fastify.post('/produtos', async (request, reply) => {
  console.log("****************")
  console.log(request.body.produto)

  const result = await client.db("Meu_pedido").collection("produtos").insertOne(
    request.body.produto
  )
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
//CADASTRO COMANDA
fastify.post('/comanda', async (request, reply) => {
  console.log("****************")
  console.log(request.body.comanda)

  const result = await client.db("Meu_pedido").collection("comanda").insertOne(
    request.body.comanda
  )
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})

//GETONE COMANDA
fastify.get('/comanda/:id', async (request, reply) => {
  console.log(request.params)
  const id = request.params.id
  console.log(id)
  const result = await client.db("Meu_pedido").collection("comanda").findOne(
    {_id: new ObjectId(id)}
  )
  
  if (result.length === 0) {
    throw new Error('No documents found')
  }
  return result
})
/* fastify.register(require('./our-first-route'))*/

fastify.listen({ port: 3001 }, function (err, address) {
  console.log("->", address)
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})