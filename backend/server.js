const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')
// const spider = require('./scrap')

app.use(
  cors({
    origin:"*"
  })
)

app.get('/', (req, res) => {
  res.json({"welcome": "Welcome"})
})

app.get('/data',(req, res) => {
    fs.readFile('data.json', function(err, data) {
        if (err) return res.send('not found')
        return res.json(JSON.parse(data))
      });
})

// app.get('/update/:pages', async (req, res) => {
//    let a = await spider(req.params.pages);
//    res.send(a)
// })

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on localhost:%d in %s mode", this.address().port, app.settings.env);
});