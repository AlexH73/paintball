const Gallery = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Галерея</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-200 h-48 rounded-lg"></div>
        <div className="bg-gray-200 h-48 rounded-lg"></div>
        <div className="bg-gray-200 h-48 rounded-lg"></div>
        <div className="bg-gray-200 h-48 rounded-lg"></div>
        <div className="bg-gray-200 h-48 rounded-lg"></div>
        <div className="bg-gray-200 h-48 rounded-lg"></div>
      </div>
    </div>
  );
};

export default Gallery;
