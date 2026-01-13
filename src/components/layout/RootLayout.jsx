import { Outlet } from "react-router-dom"
import Header from "../home/Header"
import Footer from "../home/Footer"

const RootLayout =() =>{
    return (
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}
export default RootLayout