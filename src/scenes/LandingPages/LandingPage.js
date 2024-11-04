import React from 'react';
import Header from './Header';
import Introduction from './Introduction';

// Assuming baseUrl is defined somewhere globally or passed as a prop
const baseUrl = ''; // Update this with your actual base URL

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Introduction */}
      <Introduction />

      {/* Footer Section */}
      <footer className="bg-[#040720] text-white text-center py-4 mt-auto">
        <p>&copy; 2024 GCLA - ICT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
