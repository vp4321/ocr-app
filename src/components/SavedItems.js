import React, { useState, useEffect } from 'react'
import SavedItem from './SavedItem'
import { Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import db from '../firebase'

const SavedItems = ({index}) => {
    const { currentUser } = useAuth()
    const [saved, setSaved] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {

                const res = await db
                    .collection("users")
                    .doc(currentUser.uid)
                    .get();                

                    setSaved(res.data().text);
                // setLoading(false);

            } catch (err) {
                console.error(err);
            }
            // console.log(saved);
        };

        fetchData();

    }, [saved]);

        const showSaved = async () => {
            db.collection('users').doc(currentUser.uid).get().then((res) => {
                setSaved(res.data().text);
                console.log(res.data().text);
            })
            // await console.log(saved)
        }
        const editText = async () => {
            db.collection('users').doc(currentUser.uid).get().then((res) => {
                setSaved(res.data().text);
                console.log(res.data().text);
            })
            // await console.log(saved)
        }


        return (
            <div>
                <>
                    {/* <button type="submit" onClick={showSaved} > Show</button> */}
                    {/* <div className="container">
                        <div className="row">
                            <div className="col-sm"> */}
                                {
                                        (saved)&&(saved.map((txt) => (
                                            <SavedItem key={index} txt={txt} index={index}/>
                                        )))
                                }
                            {/* </div>
                        </div>
                    </div> */}

                </>
            </div>
        )
    }

export default SavedItems
