import { useState } from 'react';
import { HiOutlineRefresh, HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const NAV_ITEMS = ['Home', 'Services', 'About', 'Contact'];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <HiOutlineRefresh className="text-white text-lg" />
              </div>
              <h1 className="text-xl font-bold text-emerald-900">EcoCollect</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item, index) => (
                <Link 
                  key={item}
                  to={item.toLowerCase() === 'home' ? '/' : `#${item.toLowerCase()}`}
                  className={`${
                    index === 0 ? 'text-emerald-700 font-medium' : 'text-gray-700'
                  } hover:text-emerald-600 transition-colors duration-200`}
                >
                  {item}
                </Link>
              ))}
              <Link to="/signup">
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                  Get Started
                </button>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 p-2"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item}
                to={item.toLowerCase() === 'home' ? '/' : `#${item.toLowerCase()}`}
                className={`${
                  index === 0 ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              to="/signup"
              className="block w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button className="w-full mt-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;