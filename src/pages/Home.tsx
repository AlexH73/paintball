const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="relative h-96 camouflage-pattern flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-4">Мужская группа Пейнтбол</h2>
          <p className="text-xl mb-8">Отдых, адреналин и camaraderie</p>
          <button className="bg-camouflage-500 hover:bg-camouflage-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Присоединиться
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Ближайшие события
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Здесь будут карточки событий */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Весенний турнир 2024</h3>
            <p className="text-gray-600 mb-4">15 мая 2024</p>
            <p>
              Присоединяйтесь к нашему весеннему турниру! Шашлыки, пиво и
              отличная игра.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
