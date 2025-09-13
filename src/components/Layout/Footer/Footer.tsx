const Footer = () => {
  return (
    <footer className="bg-camouflage-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Пейнтбол Клуб</h3>
            <p className="text-camouflage-300">Отдых для души и тела</p>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="hover:text-camouflage-300 transition-colors">
              <span className="sr-only">Facebook</span>
              {/* Иконка соцсети */}
            </a>
            <a href="#" className="hover:text-camouflage-300 transition-colors">
              <span className="sr-only">Instagram</span>
              {/* Иконка соцсети */}
            </a>
            <a href="#" className="hover:text-camouflage-300 transition-colors">
              <span className="sr-only">Telegram</span>
              {/* Иконка соцсети */}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-camouflage-700 text-center text-sm text-camouflage-300">
          <p>© 2024 Пейнтбол Клуб. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
