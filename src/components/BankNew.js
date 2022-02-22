import React, { useEffect, useState } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from 'firebase';
import app from '../config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, get, child } from 'firebase/database';

// import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

function BankNew(props) {
  const text = "New bank";

  const auth = getAuth(app);
  const database = getDatabase(app);

  const [user, loading, error] = useAuthState(auth);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("Current state:", items);

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

  if (items.length > 0) {
    return (
      <div>
        <p>{items[1].description}</p>
      </div>
    )
  }

  return (
    <div>
      <p>{text}</p>
    </div>
  );
}

export default BankNew;