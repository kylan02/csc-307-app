/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, []);

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }
    function removeOneCharacter(index) {
        console.log("Attempting to delete character at index:", index);
        deleteUser(index).then(response => {
            if (response.ok) {
                console.log("Deletion successful for index:", index);
                const updatedCharacters = characters.filter((character, i) => i !== index);
                setCharacters(updatedCharacters);
            } else {
                console.error('Failed to delete the user. Status:', response.status);
                response.json().then(data => console.error(data)).catch(err => console.error("Error parsing error response:", err));
            }
        }).catch(error => {
            console.error('Error deleting user:', error);
        });
    }

    // function removeOneCharacter(index) {
    //     const updated = characters.filter((character, i) => {
    //         return i !== index;
    //     });
    //     setCharacters(updated);
    // }
    function updateList(person) {
        postUser(person)
            .then(response => {
                if (response.status == 201) {
                    return response.json();
                }
            }).then(newPerson => {
                setCharacters([...characters, newPerson])
            })
            .catch((error) => {
                console.log(error);
            })
    }
    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        return promise;
    }
    function deleteUser(index) {
        const id = characters[index]._id
        console.log("ID: " + typeof (id))
        const promise = fetch("Http://localhost:8000/users/" + id, {
            method: "DELETE",
        });
        return promise;
    }

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}
export default MyApp;