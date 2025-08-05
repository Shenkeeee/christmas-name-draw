import React, { useState, useEffect } from "react";
import NameInput from "./components/NameInput";
import NamePool from "./components/NamePool";
import HostControls from "./components/HostControls";
import "./App.scss";
import SnowBackground from "./assets/SnowBackground";
import SoundPlayer from "./assets/SoundPlayer";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import CountdownTimer from "./assets/CountdownTimer";

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTHDOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const App = () => {
  const [names, setNames] = useState([]);
  const [assignedNames, setAssignedNames] = useState({});
  const [currentUser, setCurrentUser] = useState("");

  const fetchNames = async () => {
    const q = query(collection(db, "names"));
    onSnapshot(q, async (querySnapshot) => {
      const getNames = await querySnapshot.docs.map((doc) => doc.data().name);
      setNames(getNames);
    });
  };

  const fetchAssignedNames = async () => {
    const q = query(collection(db, "assignments"));
    onSnapshot(q, async (querySnapshot) => {
      if (!querySnapshot) {
        return;
      }
      const getAssignedNames = await querySnapshot.docs.map(
        (doc) => doc.data().assignments
      );
      if (getAssignedNames.length === 0) {
        setAssignedNames([]);
        return;
      }
      setAssignedNames(getAssignedNames[0]);
    });
  };

  useEffect(() => {
    // Fetch data immediately on mount
    fetchNames();
    deleteAllAssignments();
    fetchAssignedNames();
  }, []);

  const addName = async (name) => {
    setNames([...names, name]);

    // handling firebase docs
    try {
      fetchNames();
      await addDoc(collection(db, "names"), {
        name: name,
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
  };

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
      assignments,
    });
  };

  return (
    <>
      <SnowBackground />
      <SoundPlayer />
      <div className="wrapper">
        <h1>Karácsonyi sorsolás!</h1>
        <NameInput
          addName={addName}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
        {names.length !== 0 && (
          <NamePool
            names={names}
            currentUser={currentUser}
            deleteUser={deleteUser}
          />
        )}
        {currentUser && (
          <>
            {currentUser.toLowerCase() === "kata" && (
              <HostControls
                shuffleNames={shuffleNames}
                deleteAllAssignments={deleteAllAssignments}
              />
            )}
            {Object.keys(assignedNames).length > 0 && (
              <div>
                {/* <h2>Kapott név</h2>
                <p>{currentUser}, te őt kaptad: {assignedNames[currentUser]}!</p> */}
                <CountdownTimer
                  assignedNames={assignedNames}
                  currentUser={currentUser}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default App;
