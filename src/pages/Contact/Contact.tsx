const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Контакты</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Имя
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="message">
              Сообщение
            </label>
            <textarea
              id="message"
            //   rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-camouflage-500 hover:bg-camouflage-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
