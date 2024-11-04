import React from 'react';
import image from '../../data/image';

// Get base URL
const baseUrl = window.location.origin;

const Introduction = () => {
    return (
        <section className="bg-[#0f172a] min-h-screen grid grid-cols-1 md:grid-cols-12">
            {/* Left side: 1 column for image */}
            <div className="md:col-span-1 flex items-center justify-center p-0 relative">
                <img
                    src={image.pcimg}
                    alt="GCLA Circular"
                    className="w-full h-full object-cover " // Cover the entire space
                />
            </div>


            {/* Middle side: 5 columns for text and buttons */}
            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
                    ICT  incidents  Reporting  System
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8">

                    The IIRS (ICT IncidentS Reporting System) is a platform for users to report device-related
                    incidents, which the system then prioritizes based on severity. It includes features for task
                    assignment, allowing ICT office managers to delegate tasks to IT officers, and tracks faulty
                    devices along with their causes. Additionally, it manages both users and devices within the
                    system.

                </p>

                {/* Login and Register Buttons */}
                <div className="space-x-2 md:space-x-4">
                    <a
                        href={`${baseUrl}/login`}
                        className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </a>
                    <a
                        href={`${baseUrl}/register`}
                        className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
                    >
                        Register
                    </a>
                </div>
            </div>

            {/* Footer Section */}
      

            {/* Right side: 6 columns for background image */}
            <div className="md:col-span-6 relative flex items-center justify-center p-4">
                <img
                    src={image.serverimage}
                    alt="Server Image"
                    className="w-[800px] h-[600px] object-cover" // Adjust size and ensure it covers the container
                />
            </div>
            
        </section>
        
    );
};

export default Introduction;
