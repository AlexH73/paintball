const Hero = () => {
  return (
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
  );
};

export default Hero;
