import { Outlet } from "react-router-dom";
import { useState } from "react";
import Footer from "../home/Footer";
import Navbar from "../auth/Navbar";
import MovieDetails from "../auth/MovieDetail";

const AuthLayout = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <>
      <Navbar />
      <main>
        <Outlet context={{ setSelectedMovie }} />
      </main>

      {/* Overlay MovieDetails */}
      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onBack={() => setSelectedMovie(null)} 
        />
      )}

      <Footer />
    </>
  );
};

export default AuthLayout;
