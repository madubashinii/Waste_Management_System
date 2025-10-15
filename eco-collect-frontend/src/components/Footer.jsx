const LINKS = ['Home', 'Services', 'About Us', 'Contact'];
const CONTACTS = ['Email: info@ecocollect.com', 'Phone: +1 (555) 123-4567', 'Address: 123 Green Street'];

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-300">EcoCollect</h3>
            <p className="text-sm text-emerald-200">
              Making waste management efficient and eco-friendly for a sustainable future.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-300">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {LINKS.map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '')}`}
                    className="text-emerald-200 hover:text-emerald-300 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-300">Contact Us</h3>
            <ul className="space-y-2 text-sm text-emerald-200">
              {CONTACTS.map((contact) => (
                <li key={contact}>{contact}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-8 pt-6 text-center">
          <p className="text-sm text-emerald-200">
            © {new Date().getFullYear()} EcoCollect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

