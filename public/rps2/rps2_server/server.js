const { v4: uuidv4 } = require('uuid');
const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express()

const httpServer = require("http").createServer(app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

activeRooms = {}
idRoom = {}
iduser = {}
filledRooms = new Set();
games = {}

io.on("connection", socket => {
    console.log("New Connection: " + socket.id);
    socket.on("game-join-request", (arg) => {
        if (!(checkRoomIDValid(arg["room"]) && checkNameValid(arg["name"]))) {
            io.to(socket.id).emit("join-request-status", "Fail")
            return;
        }

        if (!(arg["room"] in activeRooms)) {
            activeRooms[arg["room"]] = []
        }
        activeRooms[arg["room"]].push(arg["name"]);
        idRoom[socket.id] = arg["room"]
        iduser[socket.id] = arg["name"]
        socket.join(arg["room"])

        if (activeRooms[arg["room"]].length == 2) {
            io.to(arg["room"]).emit("game-start", "go ahead")
            setTimeout(timeoutRoom, 1000 * 60, arg["room"])
            games[arg["room"]] = { status: "ready to count", p1: activeRooms[arg["room"]][0], p2: activeRooms[arg["room"]][1], countdown: 3, timer: 30, score: 0, p1_state: "", p2_state: "", p1_locked: false, p2_locked: false };
        }
        io.to(socket.id).emit("join-request-status", "Success")
    })

    socket.on("game-action", (arg) => {
        roomName = idRoom[socket.id]
        if (iduser[socket.id] === undefined || activeRooms[roomName] === undefined) {
            console.log("Dropped game-action in room " + roomName);
            return;
        }

        if (games[roomName]["status"] === "active") {
            if (activeRooms[roomName][0] === iduser[socket.id]) {
                games[roomName]["p1_state"] = arg
            } else if (activeRooms[roomName][1] === iduser[socket.id]) {
                games[roomName]["p2_state"] = arg
            }
        }
    })

    socket.on("disconnect", (reason) => {
        console.log("Connection " + socket.id + " has disconnected for reason: " + reason)
            // TODO: we can also remove disconnecting sockets from activeRooms so that they cannot start with only 1 person active
        delete idRoom[socket.id]
        delete iduser[socket.id]
    })
});


function timeoutRoom(room) {
    console.log("Room " + room + " has expired")
    delete games[room]
    delete activeRooms[room]
}

function countdown(room) {
    io.to(room).emit("count-down", games[room]["countdown"])
    if (games[room]["countdown"] == 0) {
        games[room]["status"] = "active"
        setTimeout(timer_down, 1000, room);
        return
    }
    games[room]["countdown"] = games[room]["countdown"] - 1;
    setTimeout(countdown, 1000, room);
}

function timer_down(room) {
    if (!(room in games)) return;
    games[room]["timer"] -= 1;
    if (games[room]["timer"] == 0) {
        games[room]["status"] = "ended"
        setTimeout(timeoutRoom, 1500, room);
        return
    }
    setTimeout(timer_down, 1000, room);

}

function updateRoomScore(room) {
    if (games[room]["p1_state"] != "" && games[room]["p2_state"] == "") games[room]["score"] += 1;
    if (games[room]["p1_state"] == "" && games[room]["p2_state"] != "") games[room]["score"] -= 1;

    if (games[room]["p1_state"] == "rock" && games[room]["p2_state"] == "paper") games[room]["score"] -= 1;
    if (games[room]["p1_state"] == "rock" && games[room]["p2_state"] == "scissors") games[room]["score"] += 1;

    if (games[room]["p1_state"] == "paper" && games[room]["p2_state"] == "scissors") games[room]["score"] -= 1;
    if (games[room]["p1_state"] == "paper" && games[room]["p2_state"] == "rock") games[room]["score"] += 1;

    if (games[room]["p1_state"] == "scissors" && games[room]["p2_state"] == "rock") games[room]["score"] -= 1;
    if (games[room]["p1_state"] == "scissors" && games[room]["p2_state"] == "paper") games[room]["score"] += 1;
}

function emitGameData() {
    for (const [room, state] of Object.entries(games)) {
        if (state["status"] === "ready to count" && state["countdown"] == 3) {
            games[room]["status"] = "counting down"
            setTimeout(countdown, 0, room);
        } else if (state["status"] === "active") {
            updateRoomScore(room)
            io.to(room).emit("game-state", state)
        } else if (state["status"] === "ended") {
            io.to(room).emit("game-state", state)
        }
    }
}

setInterval(emitGameData, 50);


function checkRoomIDValid(roomID) {
    if (roomID in games) {
        console.log("Tried to join already active game: " + roomID)
        return false;
    }

    if (roomID.length < 2 || roomID.length > 20) return false;
    if (!roomID.match(/^[0-9a-zA-Z]+$/)) return false;
    return true;
}

function checkNameValid(name) {
    // if (name in userRoom) {
    //     console.log("Tried to use already taken username: " + name)
    //     return false;
    // }
    if (name.length < 2 || name.length > 20) return false;
    if (!name.match(/^[0-9a-zA-Z]+$/)) return false;
    return true;
}

app.get("/", (req, res) => {
    res.send("Pong!")
})


const port = 3123;
console.log(`Running RPS2 on port ${port}`)
httpServer.listen(port)
