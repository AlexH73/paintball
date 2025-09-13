import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-camouflage-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-camouflage-500 rounded-full flex items-center justify-center">
              <span className="font-bold">P</span>
            </div>
            <h1 className="text-xl font-bold">Пейнтбол Клуб</h1>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="/" className="hover:text-camouflage-300 transition-colors">
              Главная
            </a>
            <a
              href="/events"
              className="hover:text-camouflage-300 transition-colors"
            >
              События
            </a>
            <a
              href="/gallery"
              className="hover:text-camouflage-300 transition-colors"
            >
              Галерея
            </a>
            <a
              href="/about"
              className="hover:text-camouflage-300 transition-colors"
            >
              О нас
            </a>
            <a
              href="/contact"
              className="hover:text-camouflage-300 transition-colors"
            >
              Контакты
            </a>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <a
              href="/"
              className="block hover:text-camouflage-300 transition-colors"
            >
              Главная
            </a>
            <a
              href="/events"
              className="block hover:text-camouflage-300 transition-colors"
            >
              События
            </a>
            <a
              href="/gallery"
              className="block hover:text-camouflage-300 transition-colors"
            >
              Галерея
            </a>
            <a
              href="/about"
              className="block hover:text-camouflage-300 transition-colors"
            >
              О нас
            </a>
            <a
              href="/contact"
              className="block hover:text-camouflage-300 transition-colors"
            >
              Контакты
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
