import React from 'react';
import { Outlet, Link } from 'react-router';

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-800">
            DoctorFinder
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">DoctorFinder</h3>
              <p className="text-gray-300">Find the right doctor with ease</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-1">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DoctorFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;