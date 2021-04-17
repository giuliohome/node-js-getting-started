var bodyParser = require('body-parser');
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
      ssl: { rejectUnauthorized: false }
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


const getHeroes = (request, response) => {
  if (request.query && request.query.name) {
      search = '%' + request.query.name + '%';
  } else {
      search = '%';
  }
  pool.query('SELECT * FROM heroes WHERE name LIKE $1 ORDER BY id ASC', [search], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const getHeroById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM heroes WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}
const createHero = (request, response) => {
  const { name } = request.body;

  pool.query('INSERT INTO heroes (name) VALUES ($1) RETURNING id', [name], (error, results) => {
    if (error) {
      throw error
    }
    var newlyCreatedId = results.rows[0].id;
    response.status(200).json({ "id": newlyCreatedId, "name": name })
  })
}
const updateHero = (request, response) => {
  const { id, name } = request.body

  pool.query(
    'UPDATE heroes SET name = $1 WHERE id = $2',
    [name, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json({ "id": id, "name": name })
    }
  )
}
const deleteHero = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM heroes WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Hero deleted with ID: ${id}`)
  })
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json()) // for parsing application/json
  .use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
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
  .get('/toh/heroes', (req,res) => {
    res.sendFile(process.cwd()+"/public/toh/index.html")
  })
  .get('/toh/dashboard', (req,res) => {
    res.sendFile(process.cwd()+"/public/toh/index.html")
  })
  .all('/toh/detail/*', function(req, res) {
    res.sendFile(process.cwd()+"/public/toh/index.html")
  })
  .get('/toh/api/heroes', getHeroes)
  .get('/toh/api/heroes/:id', getHeroById)
  .post('/toh/api/heroes', createHero)
  .put('/toh/api/heroes', updateHero)
  .delete('/toh/api/heroes/:id', deleteHero)
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
