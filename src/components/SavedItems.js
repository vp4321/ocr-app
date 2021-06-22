import React, { useState, useEffect } from 'react'
import SavedItem from './SavedItem'
import { Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import db from '../firebase'
import NavBar from './NavBar'

const SavedItems = () => {
    const { currentUser } = useAuth()
    const [saved, setSaved] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {

                const res = await db
                    .collection("users")
                    .doc(currentUser.uid)
                    .get();                

                    setSaved(res.data().textArr);
                // setLoading(false);
                    
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        

    }, [saved]);

        return (
                <>
                    <NavBar />
                    <h1 style={{textAlign:"center",padding:"2%"}} >
                        SAVED ITEMS
                    </h1>
                    <div className="container">
                        <div className="row">
                                {
                                    
                                        (saved)&&(saved.map((txt) => (
                                            <SavedItem  key={txt.id} id={txt.id} txt={txt.text} />
                                        )))
                                }
                        </div>
                    </div>

                </>
        )
    }

export default SavedItems
