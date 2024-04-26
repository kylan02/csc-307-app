import mongoose from "mongoose";
import userModel from "./user.js";
import dotenv from "dotenv"

mongoose.set("debug", true);

dotenv.config()
const connectionString = process.env.DB_STRING

mongoose.connect(connectionString, {
  autoIndex: true
})
  .catch((error) => console.log(error));

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}

// const deleteUserById = (id) => {
//   return userModel.
//   const index = users["users_list"].findIndex((user) => user["id"] === id);
//   users["users_list"].splice(index, 1);
// };

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById
};
