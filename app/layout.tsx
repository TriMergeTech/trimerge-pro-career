
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/index.css";


import React, { ReactNode } from 'react'
import { UserProvider } from "@/contexts/userContext/userContext";



function Layout({children} : {children: ReactNode}) {
  return (
   <html lang="en">
      <body className="overflow-x-hidden">
        <UserProvider>
          <Navbar/>
          <main> {children} </main>
          <Footer/>
        </UserProvider>
      </body>
   </html>
  )
}

export default Layout