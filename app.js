const express = require('express')
const app = express()
const path = require('path')
var helmet = require('helmet');

app.use(express.static(__dirname + '/public'))
app.use(helmet());
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build/')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm/')))

app.listen(80, () => {
    console.log("Server running on port 80")
})