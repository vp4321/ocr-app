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

const NavBar = () => {
    const { currentUser, logout } = useAuth()
    const [error, setError] = useState("")

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

    return (<>
        <Navbar collapseOnSelect bg="dark" expand="lg" style={{ justifyContent: "space-between" }} variant="dark">
            <Navbar.Brand href="/" className="m-3">My OCR APP</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" style={{ flexGrow: 0 }}>
                <Nav className="ml-auto mr-4">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/saved-items" >Saved</Nav.Link>
                    {/* <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Saved</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">Update Profile</NavDropdown.Item>
            </NavDropdown> */}
                    <Nav.Link href="#link" onClick={handleLogout}>Logout</Nav.Link>

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>)
}
export default NavBar