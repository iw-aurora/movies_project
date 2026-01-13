
const MovieDetails = ({ movie }) => {  
  const imageUrl = movie.imageUrl
    ? movie.imageUrl.replace('400/600', '1920/1080')
    : 'https://via.placeholder.com/1920x1080?text=No+Image';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black animate-in fade-in duration-500">
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default MovieDetails;
