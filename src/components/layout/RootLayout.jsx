import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Header from "../home/Header"
import Footer from "../home/Footer"

const RootLayout = () => {
    const { pathname } = useLocation();

    // Prevent browser from restoring scroll position
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Scroll to top on mount (refresh) and route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
export default RootLayout