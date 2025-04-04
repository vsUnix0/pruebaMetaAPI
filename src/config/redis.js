import Redis from 'ioredis'//npm install ioredis

// Crea el cliente de Redis (usa host y puerto si quieres, pero por defecto es localhost:6379)
const client = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

client.on('conect', ()=>{
  console.log('🟢Conectado a redis.')
})

client.on('error', (err)=>{
  console.log('🔴Error en redis:.', err)
})

export default client;


/*Ejemplo de como integrarlo en message handler con set, get y expire
const redisKey = `msg:${message.id}`;//guarda el message.id
const exists = await redisClient.get(redisKey);//verifica si existe en redis

if (exists) {
  console.log("Mensaje ya procesado, lo ignoramos.");
  return;//si existe entonces lo ignora
}

// Guardamos el ID para evitar re-procesar
await redisClient.set(redisKey, 'ok');
// Expira en 5 minutos
await redisClient.expire(redisKey, 300);*/
