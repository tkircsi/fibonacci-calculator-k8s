const redis = require('redis');
const keys = require('./keys');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Postgres setup
const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
});

// pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)', (err, res) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('PG init table');
// });

pgClient.on('connect', () => {
  console.log('pgClient connect');
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});

// Redis setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Routes
app.get('/values/all', async (req, res) => {
  try {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
  } catch (err) {
    console.log(err);
    res.send([]);
  }
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 100) {
    return res.status(422).send('Index too high.');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.get('/', async (req, res) => {
  res.send('API healthcheck...');
});

app.listen(keys.serverPort, () => {
  console.log(`App listening on port ${keys.serverPort}!`);
});
