import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import 'react-toastify/dist/ReactToastify.css'

// ✅ ADDED (only new line)
const API_URL = import.meta.env.VITE_API_URL

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch(API_URL)   // ✅ FIXED
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('Copied to clipboard!', { theme: "dark" })
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        } else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            await fetch(API_URL, {     // ✅ FIXED
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            })

            await fetch(API_URL, {     // ✅ FIXED
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            setform({ site: "", username: "", password: "" })

            toast('Password saved!', { theme: "dark" })
        } else {
            toast('Error: Password not saved!', { theme: "dark" })
        }
    }

    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))

            await fetch(API_URL, {     // ✅ FIXED
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })

            toast('Password Deleted!', { theme: "dark" })
        }
    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer />
            {/* UI CODE UNCHANGED */}
        </>
    )
}

export default Manager
