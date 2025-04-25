import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router";

const DoctorListingApp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [suggestions, setSuggestions] = useState([]);
  const [consultationType, setConsultationType] = useState(
    searchParams.get("consult") || ""
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    searchParams.getAll("specialty") || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        console.log(data);
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again later.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const allSpecialties = React.useMemo(() => {
    if (!doctors.length) return [];

    const specialtiesSet = new Set();
    doctors.forEach((doctor) => {
      if (doctor.specialities && Array.isArray(doctor.specialities)) {
        doctor.specialities.forEach((specialty) => {
          const specialtyStr =
            typeof specialty === "object" ? specialty.name : String(specialty);
          if (specialtyStr) specialtiesSet.add(specialtyStr);
        });
      }
    });

    return Array.from(specialtiesSet).sort();
  }, [doctors]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (consultationType) params.set("consult", consultationType);
    if (sortBy) params.set("sort", sortBy);

    selectedSpecialties.forEach((specialty) => {
      params.append(
        "specialty",
        typeof specialty === "object" ? specialty.name : specialty
      );
    });

    setSearchParams(params);
  }, [
    searchQuery,
    consultationType,
    selectedSpecialties,
    sortBy,
    setSearchParams,
  ]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const matchedDoctors = doctors
        .filter((doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(matchedDoctors);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (doctorName) => {
    setSearchQuery(doctorName);
    setSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
  };

  const handleConsultationChange = (type) => {
    console.log("Current consultation type:", consultationType);
    console.log("New consultation type:", type);
    
    if (consultationType === type) {
      setConsultationType('');
      console.log("Clearing consultation type");
    } else {
      setConsultationType(type);
      console.log("Setting consultation type to:", type);
    }
  };
  const handleSpecialtyChange = (specialty) => {
    const specialtyValue =
      typeof specialty === "object" ? specialty.name : String(specialty);

    setSelectedSpecialties((prev) => {
      const isSelected = prev.some((s) => {
        const compareValue = typeof s === "object" ? s.name : String(s);
        return compareValue.toLowerCase() === specialtyValue.toLowerCase();
      });

      if (isSelected) {
        return prev.filter((s) => {
          const compareValue = typeof s === "object" ? s.name : String(s);
          return compareValue.toLowerCase() !== specialtyValue.toLowerCase();
        });
      } else {
        return [...prev, specialtyValue];
      }
    });
  };

  const handleSortChange = (sort) => {
    setSortBy((prev) => (prev === sort ? "" : sort));
  };

  const parseExperience = (experienceStr) => {
    if (!experienceStr) return 0;
    const match = experienceStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const parseFees = (feesStr) => {
    if (!feesStr) return 0;
    const match = feesStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const matchesConsultationType = (doctor, type) => {
    if (!type) return true;

    console.log("Checking consultation type for:", doctor.name);
    console.log("Doctor clinic data:", doctor.clinic);
    console.log("Looking for type:", type);

    if (doctor.clinic) {
      if (type === "Video Consult" && doctor.clinic.video_consult === true) {
        return true;
      }
      if (type === "In Clinic" && doctor.clinic.in_clinic === true) {
        return true;
      }
    }

    return false;
  };

  const matchesSpecialty = (doctor, selectedSpecialties) => {
    if (!selectedSpecialties.length) return true;
    if (!doctor.specialities || !Array.isArray(doctor.specialities))
      return false;

    const doctorSpecialties = doctor.specialities.map((spec) =>
      typeof spec === "object"
        ? spec.name.toLowerCase()
        : String(spec).toLowerCase()
    );

    const normalizedSelectedSpecialties = selectedSpecialties.map((spec) =>
      typeof spec === "object"
        ? spec.name.toLowerCase()
        : String(spec).toLowerCase()
    );

    return doctorSpecialties.some((doctorSpecialty) =>
      normalizedSelectedSpecialties.includes(doctorSpecialty)
    );
  };

  const filteredAndSortedDoctors = doctors
    .filter((doctor) => {
      if (
        searchQuery &&
        !doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (
        consultationType &&
        !matchesConsultationType(doctor, consultationType)
      ) {
        return false;
      }

      if (
        selectedSpecialties.length > 0 &&
        !matchesSpecialty(doctor, selectedSpecialties)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "fees") {
        return parseFees(a.fees) - parseFees(b.fees); 
      } else if (sortBy === "experience") {
        return parseExperience(b.experience) - parseExperience(a.experience); 
      }
      return 0;
    });

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSuggestions([]);
    } else if (e.key === "Enter" && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].name);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Find a Doctor
        </h1>

        <div className="mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                data-testid="autocomplete-input"
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for doctors..."
                className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-lg shadow-lg">
                {suggestions.map((doctor) => (
                  <li
                    key={doctor.id}
                    data-testid="suggestion-item"
                    onClick={() => handleSuggestionClick(doctor.name)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    {doctor.name}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="mb-6">
                <h3
                  data-testid="filter-header-moc"
                  className="font-medium mb-2 text-gray-700"
                >
                  Consultation Mode
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="video-consult"
                      data-testid="filter-video-consult"
                      checked={consultationType === "Video Consult"}
                      onChange={() => handleConsultationChange("Video Consult")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor="video-consult"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Video Consult
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="in-clinic"
                      data-testid="filter-in-clinic"
                      checked={consultationType === "In Clinic"}
                      onChange={() => handleConsultationChange("In Clinic")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor="in-clinic"
                      className="ml-2 text-sm text-gray-700"
                    >
                      In Clinic
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3
                  data-testid="filter-header-speciality"
                  className="font-medium mb-2 text-gray-700"
                >
                  Speciality
                </h3>

                <div className="space-y-2 max-h-60 overflow-y-auto pl-1">
                  {allSpecialties.map((specialty, index) => {
                    const specialtyName =
                      typeof specialty === "object"
                        ? specialty.name
                        : String(specialty);
                    const specialtyId = specialtyName
                      .replace(/\s+/g, "-")
                      .replace(/[^a-zA-Z0-9-]/g, "");

                    return (
                      <div
                        key={`${specialtyId}-${index}`}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`specialty-${specialtyId}-${index}`}
                          data-testid={`filter-specialty-${specialtyId}`}
                          checked={selectedSpecialties.some(
                            (s) =>
                              (typeof s === "object" &&
                                s.name === specialtyName) ||
                              s === specialtyName
                          )}
                          onChange={() => handleSpecialtyChange(specialty)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <label
                          htmlFor={`specialty-${specialtyId}-${index}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {specialtyName}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3
                  data-testid="filter-header-sort"
                  className="font-medium mb-2 text-gray-700"
                >
                  Sort By
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sort-fees"
                      data-testid="sort-fees"
                      checked={sortBy === "fees"}
                      onChange={() => handleSortChange("fees")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor="sort-fees"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Fees (Low to High)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sort-experience"
                      data-testid="sort-experience"
                      checked={sortBy === "experience"}
                      onChange={() => handleSortChange("experience")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor="sort-experience"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Experience (High to Low)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-yellow-100 p-4 rounded-lg text-yellow-700">
                {error}
              </div>
            ) : filteredAndSortedDoctors.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">
                  No doctors match your search criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    data-testid="doctor-card"
                    className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start">
                      <img
                        src={doctor.photo || "https://via.placeholder.com/80"}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full mr-5 object-cover"
                      />
                      <div className="flex-1">
                        <Link to={`/doctor/${doctor.id}`}>
                          <h3
                            data-testid="doctor-name"
                            className="text-xl font-bold text-blue-800 hover:text-blue-600"
                          >
                            {doctor.name}
                          </h3>
                        </Link>
                        <p
                          data-testid="doctor-specialty"
                          className="text-gray-600 mb-2"
                        >
                          {doctor.specialities &&
                          Array.isArray(doctor.specialities)
                            ? doctor.specialities
                                .map((spec) =>
                                  typeof spec === "object" ? spec.name : spec
                                )
                                .join(", ")
                            : ""}
                        </p>
                        <div className="text-sm text-gray-600 mb-3">
                          {doctor.doctor_introduction}
                        </div>
                        <div className="flex flex-wrap gap-6">
                          <div>
                            <p className="text-sm text-gray-500">Experience</p>
                            <p
                              data-testid="doctor-experience"
                              className="font-medium"
                            >
                              {doctor.experience}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Consultation Fee
                            </p>
                            <p data-testid="doctor-fee" className="font-medium">
                              {doctor.fees}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Available For
                            </p>
                            <p className="font-medium">
                              {doctor.clinic ? (
                                <>
                                  {doctor.clinic.video_consult
                                    ? "Video Consult"
                                    : ""}
                                  {doctor.clinic.video_consult &&
                                  doctor.clinic.in_clinic
                                    ? ", "
                                    : ""}
                                  {doctor.clinic.in_clinic ? "In Clinic" : ""}
                                </>
                              ) : (
                                "Not specified"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/doctor/${doctor.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorListingApp;
