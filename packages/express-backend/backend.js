import express from "express";
import userService from "./user-service.js";
import cors from "cors";

const app = express();
app.use(cors());
const port = 8000;

app.use(express.json());

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    userService.findUserById(id)
        .then(result => {
            if (!result) {
                res.status(404).send("Resource not found.");
            } else {
                res.json(result.toObject()); // Converts the Mongoose document to a plain object
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    let promise;

    if (job != undefined && name != undefined) {
        promise = userService.findUserByJob(job).then(usersByJob => {
            return userService.findUserByName(name, usersByJob);
        });
    } else if (job != undefined) {
        promise = userService.findUserByJob(job);
    } else if (name != undefined) {
        promise = userService.findUserByName(name);
    }
    else {
        promise = userService.getUsers();
    }

    promise.then((result) => {
        res.json({ users_list: result })
    })
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    let promise;
    promise = userService.addUser(userToAdd);

    promise.then((result) => {
        res.status(201).json(result);
    })
});

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userService.findUserById(id); // First, find the user to get the document
        console.log("userrr: " + user)
        if (!user) {
            res.status(404).send("No user found with that ID");
            return;
        }
        const deletedUser = await userService.deleteUserById(id); // Then delete the user
        if (deletedUser) {
            res.status(200).json({
                message: "User deleted successfully",
                user: user.toObject() // Optional: return the details of the deleted user as a plain object
            });
        } else {
            res.status(404).send("No user found with that ID");
        }
    } catch (error) {
        console.error("Error in deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});