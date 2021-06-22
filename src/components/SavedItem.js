import React, { useState } from 'react'
import './SavedItem.css'
import $ from 'jquery';
import { useAuth } from "../contexts/AuthContext"
import db from '../firebase'

const SavedItem = ({ txt, id }) => {

    const [updateText, setUpdateText] = useState(txt);
    const { currentUser } = useAuth()
    const onCopy = (event) => {

        var el = $("."+id);
        console.log(el)
            el.select();
            document.execCommand('copy');
        
    }

    const onDelete = (event) => {
        db.collection('users').doc(currentUser.uid).get().then(res => {
            let textArray = res.data().textArr;
            let ind, id;
            for (let i = 0; i < textArray.length; i++) {
                if (id === textArray[i].id) {
                    ind = i;
                    break;
                }
            }
            textArray.splice(ind, 1)
            db.collection('users').doc(currentUser.uid).update({
                textArr: textArray
            });
        });
    }
    return (
        <div className="col-lg-6 item">
            <textarea className={id} cols="20" rows="10" contentEditable="true" value={updateText} suppressContentEditableWarning={true} onChange={(e) => { setUpdateText(e.target.value) }}></textarea>
            <div>
            <button id={id} className="delete" type="submit" onClick={onCopy}> <i className="fas fa-copy save-btn"></i> </button>
            <button className="delete" type="submit" onClick={onDelete}> <i className="far fa-trash-alt del-btn"></i> </button>
            </div>
        </div>
    )
}

export default SavedItem
