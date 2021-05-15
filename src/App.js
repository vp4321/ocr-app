import React, { useState } from 'react'
import Tesseract from 'tesseract.js'
import ImageUploader from 'react-images-upload'
import ClipLoader from 'react-spinners/ClipLoader'
import './App.css';

const App = () => {
  const [picUrl, setPicUrl] = useState([]);
  const [ocrText, setOcrText] = useState([]);
  
  const [isLoading , setIsLoading] = useState(false);

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

