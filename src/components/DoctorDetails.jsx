import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }
        
        const data = await response.json();
        console.log(data);
        const foundDoctor = data.find(doc => doc.id === doctorId);
        
        if (!foundDoctor) {
          throw new Error('Doctor not found');
        }
        
        setDoctor(foundDoctor);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
          <p>{error}</p>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to doctor listings
        </Link>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 p-4 rounded-lg text-yellow-700 mb-4">
          <p>Doctor not found</p>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to doctor listings
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to doctor listings
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-50 p-6 border-b">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img 
              src={doctor.photo || "https://via.placeholder.com/150"} 
              alt={doctor.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mr-6"
            />
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-2xl font-bold text-blue-800">{doctor.name}</h1>
              <p className="text-gray-600 text-lg">
                {doctor.specialities && Array.isArray(doctor.specialities) 
                  ? doctor.specialities.join(", ")
                  : ""}
              </p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start">
                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium mr-2 mb-2">
                  {doctor.experience}
                </span>
                <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium mr-2 mb-2">
                  {doctor.fees}
                </span>
                {doctor.clinic && doctor.clinic.video_consult && (
                  <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-sm font-medium mr-2 mb-2">
                    Video Consult
                  </span>
                )}
                {doctor.clinic && doctor.clinic.in_clinic && (
                  <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium mr-2 mb-2">
                    In Clinic
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{doctor.doctor_introduction}</p>
          </div>

          {doctor.languages && doctor.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Languages</h2>
              <div className="flex flex-wrap">
                {doctor.languages.map((language, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm font-medium mr-2 mb-2"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Consultation Options</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {doctor.clinic && doctor.clinic.video_consult && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg">Video Consultation</h3>
                  <p className="text-gray-600">Fee: {doctor.fees}</p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Video Consult
                  </button>
                </div>
              )}
              
              {doctor.clinic && doctor.clinic.in_clinic && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg">In-Clinic Visit</h3>
                  <p className="text-gray-600">Fee: {doctor.fees}</p>
                  <p className="text-gray-600 mb-2">The Advanced Dental Clinic, Fatima Nagar, Pune</p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book Clinic Visit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;