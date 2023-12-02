import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_KEY!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  writeConcern: { w: "majority" },
});
export default client;
