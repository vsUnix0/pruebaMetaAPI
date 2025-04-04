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
