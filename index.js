const cool = require('cool-ascii-faces');
const { Pool } = require('pg');
/* const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}); */
// https://stackoverflow.com/a/62413056
// if on heroku
if (process.env.DATABASE_URL) {
  pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
  });
} else {
// if on local
  console.log("local db: user",process.env.D_user)
  pool = new Pool({
      user: process.env.D_user,
      password: process.env.D_password,
      port: process.env.D_pport,
      host: process.env.D_host,
      database: process.env.D_database
  });
}
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/toh', (req,res) => {
    res.sendFile(process.cwd()+"/public/toh/index.html")
  })
  .get('/times', (req, res) => res.send(showTimes()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
      result += i + ' ';
    }
    return result;
  }
  