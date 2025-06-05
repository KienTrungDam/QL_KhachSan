import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./header/Header";
import About from "./about/About";
import Room from "./room/Room";
import Service from "./service/Service";
import Footer from "./footer/Footer";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToId = params.get("scrollTo");

    if (scrollToId) {
      setTimeout(() => {
        document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.search]);

  return (
    <>
      <About />
      <Room />
      <Service />
      <Footer />
    </>
  );
}

export default HomePage;
