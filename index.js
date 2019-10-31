// implement your API here

const express = require("express");
const db = require("./data/db");
const server = express();

server.listen(4000, () => {
  console.log("===Server is listening on port 4000===");
});

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Oh HELLO!");
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(data => {
      res.status(200).json({ success: true, data });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      if (data) {
        res.status(200).json({ success: true, data });
      } else {
        res
          .status(404)
          .json({ success: false, message: `The ID ${id} couldn't be found` });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The user information could not be retrieved."
      });
    });
});

server.post("/api/users", (req, res) => {
  const newInfo = req.body;
  if (!newInfo.name || newInfo.bio) {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    db.insert(newInfo)
      .then(data => {
        res.status(201).json({
          success: true,
          message: `new ID created`,
          id: data.id
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          error: "There was an error while saving the user to the database"
        });
      });
  }
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  db.update(id, newData)
    .then(data => {
      if (data === 1) {
        return res.status(200).json({
          success: true,
          message: `ID ${id} has been updated`
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `ID ${id} could not be found`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err
      });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      if (data.id) {
        res.status(200).json({
          success: true,
          Items_Deleted: data
        });
      } else {
        return res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The user could not be removed"
      });
    });
});
