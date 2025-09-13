const Events = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">События</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Весенний турнир 2024</h2>
          <p className="text-gray-600 mb-4">15 мая 2024</p>
          <p>
            Присоединяйтесь к нашему весеннему турниру! Шашлыки, пиво и отличная
            игра.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Летние игры</h2>
          <p className="text-gray-600 mb-4">20 июня 2024</p>
          <p>Летний сезон открыт! Ждем всех на поле.</p>
        </div>
      </div>
    </div>
  );
};

export default Events;
