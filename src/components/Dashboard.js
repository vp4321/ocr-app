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
import NavBar from './NavBar'

const App = () => {

  const [picUrl, setPicUrl] = useState([]);
  const [ocrText, setOcrText] = useState([]);
  let [para, setPara] = useState('');
  const [index, setIndex] = useState(0);
  const [textArr, setTextArr] = useState([{}]);

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


//   const deleteText = (event)=>{
//     event.preventDefault();
//       db.collection('users').doc(currentUser.uid).get().then(res => {
//       let textArray = res.data().textArr;
//       let ind,id;
//       for(let i=0; i < textArray.length; i++) {
//           if(id === textArray[i].id) {
//               ind=i;
//               break;
//           }
//       }
//       textArray.splice(ind, 1)
//       db.collection('users').doc(currentUser.uid).update({
//           textArr: textArray
//       });
//   });
// }


  const saveText = (event) => {
    event.preventDefault();
    db.collection('users').doc(currentUser.uid).get().then((res) => {
      if (res.exists) {

        setIndex(res.data().textArr.length);
        let  arr = [...res.data().textArr,{
          text: para,
          id: res.data().textArr.length
        }]
        
        db.collection('users').doc(currentUser.uid).update({
          textArr: arr
        })
      }
      else {
        db.collection("users").doc(currentUser.uid).set({
          textArr:[ {
            text: para,
            id: 0
          }]
        })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });

      }
    })    
  }
  const runOcr = () => {
    setIsLoading(true);
    picUrl.forEach((picture) => {
      Tesseract.recognize(picture, "eng").then(({ data: { text } }) => {
        // setOcrText((old) => (old.concat("\n"+ text)));
        setOcrText((oldarray) => [...oldarray, text]);
        console.log(ocrText)
        setPara(text)
                  
        setIsLoading(false)
      })
    })


  }

  return (
    <>
    <NavBar />
      
      <div className="center">

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
                  <button className="save" type="submit" onClick={saveText} > <i className="far fa-save save-btn"></i></button>
                </form>
              </>
            ) : null

        }
      </div>
    </>
  )

}
export default App

