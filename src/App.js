import React, { useState, useEffect } from 'react';
import NameInput from './components/NameInput';
import NamePool from './components/NamePool';
import HostControls from './components/HostControls';
import "./App.scss";
import SnowBackground from './assets/SnowBackground';
import SoundPlayer from './assets/SoundPlayer';


import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, setDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiPQ2jIxTCD2i3OcpAYGnHbTH8VC0Jaqs",
  authDomain: "karacsonyi-huzas.firebaseapp.com",
  projectId: "karacsonyi-huzas",
  storageBucket: "karacsonyi-huzas.appspot.com",
  messagingSenderId: "229964898859",
  appId: "1:229964898859:web:dc886ef689176f6d7c406e"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);



const App = () => {
  const [names, setNames] = useState([]);
  const [assignedNames, setAssignedNames] = useState({});
  const [currentUser, setCurrentUser] = useState('');

  const fetchNames = async () => {
    const querySnapshot = await getDocs(collection(db, "names"));
    const getNames = querySnapshot.docs.map(doc => doc.data().name);
    setNames(getNames);
  };

  const fetchAssignedNames = async () => {
    // await deleteDoc(doc(db, "assigments"));
    const querySnapshot = await getDocs(collection(db, "assignments"));
    if (!querySnapshot) {
      return;
    }
    const getAssignedNames = await querySnapshot.docs.map(doc => doc.data().assignments);
    if (getAssignedNames.length === 0) {
      return;
    }

    setAssignedNames(getAssignedNames[0]);

    // console.log(getAssignedNames);
    // console.log(assignedNames);
  };

  useEffect(() => {
    // Fetch data immediately on mount
    fetchNames();
    deleteAllAssignments();

    const intervalId = setInterval(() => {
      fetchNames();
      fetchAssignedNames();
    }, 500);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  const addName = async (name) => {
    setNames([...names, name]);


    // handling firebase docs
    try {
      fetchNames();
      await addDoc(collection(db, "names"), {
        name: name
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteAllAssignments = async () => {
    const q = query(collection(db, "assignments"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    setAssignedNames({});
  }

  const deleteUser = async (name) => {
    try {
      const q = query(collection(db, "names"), where("name", "==", name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const shuffleNames = async () => {
    if (names.length <= 1) {
      return;
    }

    let shuffled;
    let assignments;
    let isSelfAssigned;

    do {
      shuffled = names.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      isSelfAssigned = false;
      assignments = {};

      for (let i = 0; i < names.length; i++) {
        if (names[i] === shuffled[i]) {
          isSelfAssigned = true;
          break;
        }
        assignments[names[i]] = shuffled[i];
      }
    } while (isSelfAssigned);

    // delete all prev. assignments
    await deleteAllAssignments();
    await addDoc(collection(db, "assignments"), {
      assignments
    });
  };

  return (
    <>
      <SnowBackground />
      <SoundPlayer />
      <div className='wrapper'>
        <h1>Karácsonyi sorsolás!</h1>
        <NameInput addName={addName} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        {names.length !== 0 && <NamePool names={names} currentUser={currentUser} deleteUser={deleteUser} />}
        {currentUser && (
          <>
            {currentUser.toLowerCase() === 'kata' && <HostControls shuffleNames={shuffleNames} deleteAllAssignments={deleteAllAssignments}  />}
            {Object.keys(assignedNames).length > 0 && (
              <div>
                <h2>Kapott név</h2>
                <p>{currentUser}, te őt kaptad: {assignedNames[currentUser]}!</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
