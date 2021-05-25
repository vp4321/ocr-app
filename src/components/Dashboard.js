import React, { useState, useEffect } from 'react'
import Tesseract from 'tesseract.js'
import ImageUploader from 'react-images-upload'
import ClipLoader from 'react-spinners/ClipLoader'
import './Dashboard.css';
import db from '../firebase'
import firebase from 'firebase/app';
import app from '../firebase'
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card, Button, Alert, Navbar, NavDropdown, Nav } from "react-bootstrap"
import SavedItems from './SavedItems'

const App = () => {

  const [picUrl, setPicUrl] = useState([]);
  const [ocrText, setOcrText] = useState([]);
  const [para, setPara] = useState('');
  const [index, setIndex] = useState(-1);
  let [text, setText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  const onDrop = (_, pictureURL) => {
    setPicUrl(pictureURL);
  }

  const displayText = () => {
    db.collection('users').doc(currentUser.uid).get().then((res) => {
      console.log(res.data().title)
    })

  }

  const saveText = (event) => {
    event.preventDefault();
    db.collection('users').doc(currentUser.uid).get().then((res) => {
      console.log(res.data());
      if (res.exists) {
        setText(res.data().arr.text);
        db.collection('users').doc(currentUser.uid).update({
            arr: 
            [{text: para,
                id: index}]
        }, { merge: true })
      }
      else {
        db.collection("users").doc(currentUser.uid).set({
            text: ocrText,
            id: index
        })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });

      }
    })

    // setOcrText([]);
  }
  const runOcr = () => {
    setIsLoading(true);
    picUrl.forEach((picture) => {
      Tesseract.recognize(picture, "eng").then(({ data: { text } }) => {
        // setOcrText((old) => (old.concat("\n"+ text)));
        setOcrText((oldarray) => [...oldarray, text]);
        setPara((s)=>{
          s.concat('\n'+ ocrText)
        })
        setIsLoading(false)
      })
    })


  }

  return (
    <>
      <Navbar collapseOnSelect bg="dark" expand="lg" style={{ justifyContent: "space-between" }} variant="dark">
        <Navbar.Brand href="#home" className="m-3">My OCR APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" style={{ flexGrow: 0 }}>
          <Nav className="ml-auto mr-4">
            <Nav.Link href="#home" >Home</Nav.Link>
            <Nav.Link href="#home" >Guide</Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">History</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">Update Profile</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#link" onClick={handleLogout}>Logout</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="center">

        {/* <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
            </Link>
            </Card.Body>
         </Card> */}
          {/* <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              Log Out
          </Button>
          </div> */}
        <ImageUploader
          withIcon={true}
          withPreview={true}
          buttonText="Choose Images"
          onChange={onDrop}
          imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
          maxFileSize={5242880}
        />
        {
          (picUrl && picUrl.length>0 && !isLoading )? (
            <div className="ocr-button mb-3" onClick={runOcr} >
              Generate Text
            </div>
          ) : (( picUrl && picUrl.length>0) ? (<ClipLoader color="#000" loading={isLoading} size={100} />) : null)
        }


        {
          ocrText.length > 0 ?
            (
              <>
                <ul className="ocr-list" contentEditable="true" suppressContentEditableWarning={true}>
                  {

                      <li className="ocr-element">
                        {ocrText}
                      </li>

                  }
                </ul>
                <form>
                  <br />
                  <button type="submit" onClick={saveText} > <i className="far fa-save save-btn"></i></button>
                </form>
              </>
            ) : null

        }
        <button type="submit" onClick={displayText} > Display</button>
        <SavedItems index={index}/>
      </div>
    </>
  )

}
export default App

