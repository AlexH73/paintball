import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext/AppContext";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events/Events";
import Gallery from "./pages/Gallery/Gallery";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import EventDetails from "./pages/EventDetails/EventDetails";
import Admin from "./pages/Admin/Admin";
import "./styles/globals.css";
import DebugInfo from "./components/ui/DebugInfo/DebugInfo";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <DebugInfo />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
