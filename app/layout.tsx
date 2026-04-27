
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/index.css";


import React, { ReactNode } from 'react'



function Layout({children} : {children: ReactNode}) {
  return (
   <html lang="en">
      <body className="overflow-x-hidden">
        <Navbar/>
        <main> {children} </main>
        <Footer/>
        </body>
    </html>
    
  )
}

export default Layout