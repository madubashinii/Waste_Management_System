import { HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';
import WasteManagementSvg from '../assets/Waste management-pana.svg';

const FEATURES = [
  {
    Icon: HiOutlineLocationMarker,
    title: 'Real-Time Tracking',
    description: 'Track waste collection vehicles in real-time and get accurate arrival estimates.'
  },
  {
    Icon: HiOutlineCalendar,
    title: 'Smart Scheduling',
    description: 'Optimized collection routes and schedules for maximum efficiency.'
  },
  {
    Icon: IoLeafOutline,
    title: 'Eco-Friendly',
    description: 'Reduce carbon footprint with optimized routes and sustainable practices.'
  }
];

const Home = () => {
  return (
    <main className="flex-grow">
      <section className="relative bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Smart Waste Management for a 
                <span className="text-emerald-300"> Greener Tomorrow</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-emerald-200">
                Revolutionizing waste collection with efficient scheduling, 
                real-time tracking, and eco-friendly solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-400 text-emerald-900 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-300 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
                <button className="bg-transparent border-2 border-emerald-300 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700/50 transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>

            <div className="hidden md:block">
              <img 
                src={WasteManagementSvg} 
                alt="Waste Management Illustration" 
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" 
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-900">
            Why Choose EcoCollect?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ Icon, title, description }) => (
              <div key={title} className="bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-emerald-900">{title}</h3>
                <p className="text-emerald-800">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg mb-8 text-emerald-200">
            Join thousands of users making waste management smarter and more sustainable.
          </p>
          <button className="bg-emerald-400 text-emerald-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-emerald-300 transition-all duration-200 shadow-lg hover:shadow-xl">
            Start Today
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;

