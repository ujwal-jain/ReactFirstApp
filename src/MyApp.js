import React, {useState, useEffect} from 'react'
import Table from './Table.js'
import Form from './Form.js'
import axios from 'axios';

const characters = [];

function MyApp() {
  const [characters, setCharacters] = useState([]);

  async function fetchAll(){
     try {
        const response = await axios.get('http://localhost:5000/users');
        return response.data.users_list;     
     }
     catch (error){
        //We're not handling errors. Just logging into the console.
        console.log(error); 
        return false;         
     }
  }

  async function makePostCall(person) {
    try {
      const response = await axios.post('http://localhost:5000/users', person);
      return response
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  async function makeDeleteCall(index) {
    try {
      const deleteId = characters[index]['id'];
      const response = await axios.delete(`http://localhost:5000/users/${deleteId}`);
      return response
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    fetchAll().then( result => {
      if (result)
        setCharacters(result);
    });
  });

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )

  function removeOneCharacter (index) {
    makeDeleteCall(index).then((result) => {
      if (result && result.status === 204) {
        const updated = characters.filter((character, i) => {
          return i !== index
        });
        setCharacters(updated);
      }
      else {
        console.log("Error deleting character");
      }
    });
  }

  function updateList(person) {
    makePostCall(person).then((result) => {
      if (result && result.status === 201) 
        setCharacters([...characters, person]);
      else
        console.log("Error updating characters");
    });
  }
}


export default MyApp;
