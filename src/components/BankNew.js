import React, { useEffect, useState } from 'react';
import '../css/Bank.css';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from 'firebase';
import app from '../config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, get, child, update } from 'firebase/database';

// import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import CardList from './Card.js';

function BankNew(props) {
  const text = "New bank";

  const auth = getAuth(app);
  const database = getDatabase(app);

  const [user, loading, error] = useAuthState(auth);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [accomplishment, setAccomplishment] = useState();
  const [status, setStatus] = useState();
  
  // console.log("Current state:", items);

  // console.log("Loading", loading);

  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    // } else {
      // setIsLoading(true);
    }
  });

  useEffect(() => {
    if (isLoading !== false) {
      // console.log("User", user.uid);
      const dbRef = ref(database, 'users/' + user.uid + '/data');
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        if (data === undefined) {
          setItems([]);
          return null;
        }
        const keys = Object.keys(data);
        console.log("Keys", keys);
        const newItems = keys.map((key) => {
          const currentItem  = data[key];
          currentItem.key = key;
          // console.log("Current item", key, currentItem);
          return currentItem;
        })
        console.log("New items!", newItems);
        setItems(newItems);
      });
    } else {
      console.log("Did not retrieve user location from database");
    }
  }, []);

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  }

  const addNewAccomplishment = async () => {
    let thisAccomplishment = {
      complete: true,
      description: accomplishment,
      id: items.length + 1,
      key: items.length + ""
    }
    setItems(items.push(thisAccomplishment));
    update(ref(database, 'users/' + user.uid), {
        data: items
    });
  }

  const deleteCard = id => {
    console.log("Button pushed for card", id);
    // let newItems = items.filter((item) => {return item;})
    let newItems = items.filter((currentItem) => {
      console.log(currentItem.id, id, currentItem.id !== id)
      return currentItem.id !== id;
    })
    setItems(newItems);
    update(ref(database, 'users/' + user.uid), {
      data: newItems
    });
  }

  if (items.length > 0) {
    return (
      <div>
        {/* <p>{items[1].description}</p> */}
        <h4>What's something you're proud of?</h4>
        <p><em>This only works if you are already logged in.</em></p>
        <input
          placeholder="Today I was able to..."
          onChange={(event) => {
            setAccomplishment(event.target.value);
          }}
        />
        <button onClick={addNewAccomplishment}>Add accomplishment</button>
        <h2 className="bank-title">Your Bank</h2>
        <CardList items={items} deleteCard={deleteCard} />
      </div>
    )
  } else if (loading) { // does not work at the moment
    return (
      <p>Loading your card list.</p>
    )
    } else {
    return (
    <p>You have not added to your credibility bank!</p>
    )
  }

  /*return (
    <div>
      <p>{text}</p>
    </div>
  );*/
}

export default BankNew;