import React, { useState } from 'react'
import './SavedItem.css'
import { useAuth } from "../contexts/AuthContext"
import db from '../firebase'

const SavedItem = ({ txt ,index }) => {

    const [updateText, setUpdateText] = useState(txt);
    const [obj, setObj] = useState({});
    const { currentUser } = useAuth()

    const onUpdate = () => {
        
        db.collection('users').doc(currentUser.uid).get().then((res) => {
            console.log(res.data())
            setObj(res.data().filter((object)=>{
                return object.id ===index;
            }))
            setObj({text:updateText,id:index})
            db.collection('users').doc(currentUser.uid).update({
                textObj: obj
            }, { merge: true })
        })
    }
    const onDelete = () => {
        db.collection('users').doc(currentUser.uid).get().then((res) => {
            setObj(res.data().textObj.filter((object)=>{
                return object.id ===index;
            }))
            db.collection('users').doc(currentUser.uid).update({
                textObj: {
                    text: updateText,
                    id: index
                }
            }, { merge: true })
        })
    }
    return (
        <div>
            <textarea cols="80" contentEditable="true" value={updateText} suppressContentEditableWarning={true} onChange={(e)=>{setUpdateText(e.target.value)}}></textarea>
            <button type="submit" onClick={onUpdate}> Update</button>
            <button type="submit" onClick={onDelete}> Delete </button>
        </div>
    )
}

export default SavedItem
