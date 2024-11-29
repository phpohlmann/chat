import React from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Correct imports for auth
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore'; // Correct imports for firestore

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCstVfxqgVaLo8azj-LajEJytflFjVrdt8",
  authDomain: "coolchat-457e8.firebaseapp.com",
  projectId: "coolchat-457e8",
  storageBucket: "coolchat-457e8.firebasestorage.app",
  messagingSenderId: "73710498669",
  appId: "1:73710498669:web:b8c9d547edcc97cbc92064",
  measurementId: "G-L1GX7E31ER"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 
const firestore = getFirestore(app); 

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        {}
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider); 
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button> 
  );
}

function ChatRoom() {

  const dummy = React.useRef();

  const messagesRef = collection(firestore, 'messages'); 
  const q = query(messagesRef, orderBy('createdAt'), limit(25)); 

  const [messages] = useCollectionData(q, { idField: 'id' });

  const [formValue, setFormValue] = React.useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(), 
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
    <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

    <div ref={dummy}></div>

    </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User" />
      <p>{text}</p>
    </div>
  );
}

export default App;
