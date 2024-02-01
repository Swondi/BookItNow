import { MongoClient } from 'mongodb';
import { compareSync, hashSync } from 'bcrypt'

const uri = 'mongodb+srv://frankymaca:FrankyMaca2002@cluster0.bmrge7k.mongodb.net/?retryWrites=true&w=majority'
interface User {
  name: string
  email: string
  password: string
}

export async function createUser(name: string, email: string, password: string) {
  
  try {
    const client = new MongoClient(uri)
    await client.connect()
    
    const db = client.db('Users')
    const existingUsers = db.collection<User>('authentication')
    const alreadyExists = existingUsers.find({ email: email })

    if (await alreadyExists.hasNext()) {
      console.log('User already exists')
      await client.close()
      return
    }

    const collection = db.collection('authentication')
    const result = await collection.insertOne({
      name: name,
      email: email,
      password: hashSync(password, 10)
    })

    console.log(`User added ${result.insertedId}`)
    await client.close()
  }
  catch (err) {
    console.error(err)
  }
}

export async function deleteUser(email: string) {

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db('Users')
    const collection = db.collection('authentication')
    const result = await collection.deleteOne({ email: email })

    console.log(`Users deleted ${result.deletedCount}`)
    client.close()
  }
  catch (err) {
    console.error(err)
  }
}

export async function login(email: string, password: string) {

  let user = null

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db('Users')
    const collection = db.collection('authentication')

    const match = collection.find({ email: email })

    user = await match.next() as User | null

    client.close()
    
    if (user) {
      const passwordMatches = compareSync(password, user.password)

      if (passwordMatches) {
        console.log(`Successfully logged as ${user.name}`)
        return user
      }
      else {
        console.log('Password does not match');
        user = null
      }
    }
    else {
      console.log('User not found');
    }
  }
  catch (err) {
    console.error(err)
  }

  return user
}

// createUser('katherine', 'katherine@gmail.com', 'frankyismybf')
// deleteUser('frankymacaspam@gmail.com')
login('katherine@gmail.com', 'frankyismybf').then(user => {
  if (!user) {
    console.log(user);
    return
  }

  console.log(user.name);
  console.log(user.email);
  console.log(user.password);
})