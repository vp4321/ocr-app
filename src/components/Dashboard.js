import React, { useState } from 'react'
import Tesseract from 'tesseract.js'
import ImageUploader from 'react-images-upload'
import ClipLoader from 'react-spinners/ClipLoader'
import './Dashboard.css';
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card, Button, Alert } from "react-bootstrap"

const App = () => {
  const [picUrl, setPicUrl] = useState([]);
  const [ocrText, setOcrText] = useState([]);
  
  const [isLoading , setIsLoading] = useState(false);

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

  const onDrop = (_,pictureURL)=>{
    setPicUrl(pictureURL);
  }
  const runOcr = ()=>{
    picUrl.forEach((picture) =>{
      Tesseract.recognize(picture,"eng").then(({data:{text}})=>{
        setOcrText((oldarray)=>[...oldarray,text]);
      })
    })
    setIsLoading(true);
  }

  return (
    <div className="center">
      <header className="title">
        <h1>My OCR App</h1>
      </header>

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <ImageUploader
      withIcon={true}
      withPreview={true}
      buttonText="Choose Images"
      onChange={onDrop}
      imgExtension={[".jpg",".gif",".png",".jpeg"]}
      maxFileSize={5242880}
      />
      <div className="ocr-button" onClick={runOcr} >
        Generate Text
      </div>   
      {
        ocrText.length >0 ?
        (
          <ul className="ocr-list">
            {
              ocrText.map((ot)=>(
                <li className="ocr-element" key={ocrText.indexOf(ot)}>
                  <strong>{ocrText.indexOf(ot)+1}-</strong>
                  {ot}
                </li>
              ))
            }
          </ul>
        ):(<ClipLoader color="#000" loading={isLoading} size={200} />)
      }
    </div>

  )

    }
export default App

