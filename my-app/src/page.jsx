import React, { useState, useEffect } from 'react';
// api.js से import करें
import { createAppointment, getMyAppointments } from "./api";

// (Note: To make the appointment list persistent in a real app,
// you would ensure the API functions save/fetch to a real backend.)

const HospitalWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Schema के अनुसार updated formData state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // डॉक्टर और डिपार्टमेंट को सीधे फॉर्म में भरने के लिए
    doctorName: '',
    specialist: 'Cardiology', // Mongoose Schema में 'department' की जगह 'specialist'
    date: '',
    time: '',
    symptom: '' // Mongoose Schema में 'reason' की जगह 'symptom'
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  

 // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        
    
        const res = await getMyAppointments();

        console.log("API RESPONSE =", res.data);

        let incomingData = res.data; 
        
        
        const rawList = incomingData.data && Array.isArray(incomingData.data) 
            ? incomingData.data
            : Array.isArray(incomingData)
            ? incomingData 
            : [];
        
      
        const processedList = rawList.map(app => ({
            ...app,
            id: app._id || app.id || Math.random().toString(36).substring(2, 9), // Use _id as ID
            status: app.status || "Confirmed", 
            specialist: app.specialist || app.department, // Fallback for specialist/department
            symptom: app.symptom || app.reason,         // Fallback for symptom/reason
        }));

        setAppointments(processedList);

      } catch (err) {
        console.error("Error fetching appointments", err);
        setError("Error fetching appointments. Please ensure you are logged in.");
        setAppointments([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  // 🗑️ Delete Appointment Function (Client-side Mock/Placeholder)
  // *NOTE: Since you didn't provide a delete API endpoint, this performs a local deletion.*
  const deleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      // Assuming a backend API call would be here: await API.delete(`/apoint/${id}`);
      setAppointments(prev => prev.filter(app => app.id !== id));
      console.log(`Appointment ${id} deleted locally.`);
    }
  };


  // 🖱️ Smooth scroll service & Active section detection (Unchanged)
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'doctors', 'appointments', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 📝 Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 🚀 FORM SUBMIT → Send to Backend API
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    try {
      // API.js से createAppointment कॉल करें
      const res = await createAppointment(formData); 

      // New appointment object (assuming backend returns the saved appointment)
      const newAppointment = {
        ...res.data,
        id: res.data._id || Math.random().toString(36).substring(2, 9), // Use _id
        status: "Confirmed",
        bookingDate: formatDate(new Date().toISOString()),
      };

      // Add new appointment to list
      setAppointments(prev => [...prev, newAppointment]);

      // Success popup
      setBookingSuccess(true);

      // Reset form (specialist और doctorName को pre-fill करने से रोकने के लिए)
      setFormData({
        name: '',
        email: '',
        phone: '',
        doctorName: '',
        specialist: 'Cardiology', // Default reset
        date: '',
        time: '',
        symptom: ''
      });

      setTimeout(() => {
        setBookingSuccess(false);
        setShowAppointmentForm(false);
      }, 3000);

    } catch (err) {
      console.error("Error creating appointment:", err.response ? err.response.data : err.message);
      alert(`Appointment booking failed: ${err.response?.data?.message || 'Check your network and login status.'}`);
    }
  };

  // 🗓️ Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 📅 today date for input min
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // =========================================================================
  // RENDER SECTION
  // =========================================================================

  return (
    <div className="font-sans">
      {/* Navigation Header (Unchanged) */}
      <header className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-800">MediCare<span className="text-blue-500">+</span></h1>
              <p className="text-xs text-gray-500">Advanced Healthcare Solutions</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['home', 'about', 'services', 'doctors', 'appointments', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`font-medium capitalize transition-colors duration-300 ${
                  activeSection === section ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {section === 'home' ? 'Home' : 
                  section === 'about' ? 'About Us' :
                  section === 'services' ? 'Services' :
                  section === 'doctors' ? 'Our Doctors' :
                  section === 'appointments' ? 'My Appointments' : 'Contact'}
              </button>
            ))}
          </nav>
          
          {/* Mobile Menu Button (Unchanged) */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          {/* Appointment Button (Unchanged) */}
          <button 
            onClick={() => setShowAppointmentForm(true)}
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition duration-300"
          >
            Book Appointment
          </button>
        </div>
        
        {/* Mobile Navigation Menu (Unchanged) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              {['home', 'about', 'services', 'doctors', 'appointments', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`py-2 font-medium capitalize text-left ${
                    activeSection === section ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {section === 'home' ? 'Home' : 
                    section === 'about' ? 'About Us' :
                    section === 'services' ? 'Services' :
                    section === 'doctors' ? 'Our Doctors' :
                    section === 'appointments' ? 'My Appointments' : 'Contact'}
                </button>
              ))}
              <button 
                onClick={() => {
                  setShowAppointmentForm(true);
                  setIsMenuOpen(false);
                }}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition duration-300"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Appointment Booking Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Book an Appointment</h2>
                <button 
                  onClick={() => setShowAppointmentForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Appointment Booked Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your appointment has been confirmed. Your Appointment ID is **{appointments[appointments.length - 1]?.id}**.</p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-blue-800 font-medium">Doctor: {appointments[appointments.length - 1]?.doctorName || 'N/A'}</p>
                    <p className="text-blue-800">Please arrive 15 minutes before your scheduled time.</p>
                  </div>
                  <button 
                    onClick={() => setShowAppointmentForm(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAppointmentSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    {/* Email Address */}
                    <div>
                      <label className="block text-gray-700 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    {/* Phone Number */}
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    {/* Specialist (was Department) */}
                    <div>
                      <label className="block text-gray-700 mb-2">Specialist (Department) *</label>
                      <select 
                        name="specialist"
                        value={formData.specialist}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Oncology">Oncology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="General Medicine">General Medicine</option>
                        <option value="Dentistry">Dentistry</option>
                      </select>
                    </div>
                    {/* Doctor Name */}
                     <div>
                      <label className="block text-gray-700 mb-2">Preferred Doctor Name *</label>
                      <input 
                        type="text" 
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Dr. Suraj Joshi"
                        required
                      />
                    </div>
                     <div className="hidden md:block"></div> {/* Alignment fix */}
                    {/* Appointment Date */}
                    <div>
                      <label className="block text-gray-700 mb-2">Appointment Date *</label>
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {/* Preferred Time */}
                    <div>
                      <label className="block text-gray-700 mb-2">Preferred Time *</label>
                      <select 
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Reason for Visit (Symptom) */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Reason for Visit (Symptom) *</label>
                    <textarea 
                      name="symptom" // Changed name to match schema
                      value={formData.symptom}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe your symptoms or reason for appointment"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-600 text-sm mb-4 sm:mb-0">
                      * Required fields. We'll contact you to confirm your appointment.
                    </p>
                    <div className="flex space-x-4">
                      <button 
                        type="button"
                        onClick={() => setShowAppointmentForm(false)}
                        className="border border-gray-400 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-full transition duration-300"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main>
        {/* Enhanced Hero Section (Unchanged) */}
        <section id="home" className="pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 lg:pr-8">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full mb-6 animate-fade-in">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-blue-800 font-medium text-sm">24/7 Emergency Services Available</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Advanced Healthcare <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    For Everyone
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                  Experience world-class medical care with cutting-edge technology and compassionate healthcare professionals dedicated to your wellbeing.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="text-3xl md:text-4xl font-bold text-blue-600">250+</div>
                      <div className="ml-1 text-blue-400">+</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Expert Doctors</div>
                  </div>
                  <div className="text-center border-l border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <div className="text-3xl md:text-4xl font-bold text-cyan-600">500+</div>
                      <div className="ml-1 text-cyan-400">+</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Medical Beds</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="text-3xl md:text-4xl font-bold text-blue-600">99%</div>
                      <div className="ml-1 text-blue-400">%</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Patient Satisfaction</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button 
                    onClick={() => setShowAppointmentForm(true)}
                    className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <span className="mr-2">Book Appointment Now</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button 
                    onClick={() => scrollToSection('appointments')}
                    className="group bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-semibold py-4 px-8 rounded-xl border-2 border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    View My Appointments
                  </button>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                      ))}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Trusted by</div>
                      <div className="font-semibold text-gray-800">5000+ Patients</div>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Certified</div>
                      <div className="font-semibold text-gray-800">ISO 9001:2015</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-50 animate-pulse-slow"></div>
                  <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full opacity-30 animate-pulse-slow animation-delay-1000"></div>
                  <div className="absolute top-1/2 -left-8 w-32 h-32 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full opacity-40 animate-pulse-slow animation-delay-2000"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1758691462493-120a069304e6?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Doctor with patient in modern hospital" 
                      className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-fade-in-up">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Average Wait Time</div>
                          <div className="font-bold text-gray-800">15 Minutes</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-4 shadow-lg animate-fade-in-up animation-delay-300">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className="text-xs opacity-90">Emergency Hotline</div>
                          <div className="font-bold text-lg">(123) 456-7890</div>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs animate-float animation-delay-500">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <div className="font-semibold text-gray-800">Fast Diagnostics</div>
                    </div>
                    <p className="text-sm text-gray-600">Advanced imaging and lab results within hours.</p>
                  </div>
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-100 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Us Section (Unchanged) */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About <span className="text-blue-600">MediCare+</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We are a leading healthcare provider committed to delivering exceptional medical services with compassion and cutting-edge technology.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <img 
                  src="https://images.pexels.com/photos/6812453/pexels-photo-6812453.jpeg" 
                  alt="Hospital facility" 
                  className="rounded-2xl shadow-lg"
                />
              </div>
              
              <div className="md:w-1/2 md:pl-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Comprehensive Healthcare Services</h3>
                <p className="text-gray-600 mb-6">
                  Established in 2005, MediCare+ has grown to become one of the most trusted healthcare institutions in the region. Our mission is to provide accessible, high-quality healthcare to all patients.
                </p>
                
                <div className="space-y-4">
                  {[
                    { title: 'Advanced Technology', desc: 'State-of-the-art medical equipment for accurate diagnosis and treatment.' },
                    { title: 'Expert Medical Team', desc: 'Board-certified doctors and healthcare professionals with years of experience.' },
                    { title: 'Patient-Centered Care', desc: 'Personalized treatment plans focused on individual patient needs.' },
                    { title: '24/7 Emergency Services', desc: 'Round-the-clock emergency care with rapid response teams.' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowAppointmentForm(true)}
                  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section (Minor update to reflect 'specialist') */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our <span className="text-blue-600">Medical Services</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a wide range of specialized medical services to meet all your healthcare needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Cardiology', 
                  desc: 'Comprehensive heart care including diagnostics, treatment, and rehabilitation.',
                  icon: '❤️'
                },
                { 
                  title: 'Neurology', 
                  desc: 'Advanced care for brain and nervous system disorders with cutting-edge technology.',
                  icon: '🧠'
                },
                { 
                  title: 'Orthopedics', 
                  desc: 'Treatment for bone, joint, and muscle conditions with surgical and non-surgical options.',
                  icon: '🦴'
                },
                { 
                  title: 'Pediatrics', 
                  desc: 'Specialized care for infants, children, and adolescents in a child-friendly environment.',
                  icon: '👶'
                },
                { 
                
                  title: 'Oncology', 
                  desc: 'Comprehensive cancer care including chemotherapy, radiation, and supportive therapy.',
                  icon: '🩺'
                },
                { 
                  title: 'Emergency Care', 
                  desc: '24/7 emergency services with rapid response teams and advanced life support.',
                  icon: '🚑'
                }
              ].map((service, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <button 
                    onClick={() => {
                      // Changed 'department' to 'specialist'
                      setFormData(prev => ({...prev, specialist: service.title}));
                      setShowAppointmentForm(true);
                    }}
                    className="text-blue-600 font-medium flex items-center"
                  >
                    Book Appointment
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button 
                onClick={() => setShowAppointmentForm(true)}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-full transition duration-300"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </section>
        
        {/* Doctors Section (Updated to pre-fill doctorName and specialist) */}
        <section id="doctors" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our <span className="text-blue-600">Expert Doctors</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our team of board-certified physicians and specialists are dedicated to providing exceptional patient care.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  name: 'Dr. Suraj Joshi', 
                  specialty: 'Cardiology', // Changed to match specialist field
                  exp: '15 years',
                  image: 'https://images.unsplash.com/photo-1612276529731-4b21494e6d71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                { 
                  name: 'Dr. Mahesh Kumar', 
                  specialty: 'Neurology', // Changed to match specialist field
                  exp: '12 years',
                  image: 'https://images.unsplash.com/photo-1659353888101-6e53e32515fe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                { 
                  name: 'Dr. Priya Sharma', 
                  specialty: 'Pediatrics', // Changed to match specialist field
                  exp: '10 years',
                  image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                { 
                  name: 'Dr. Rishabh Singh', 
                  specialty: 'Orthopedics', // Changed to match specialist field
                  exp: '18 years',
                  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
              ].map((doctor, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 text-sm mb-4">Experience: {doctor.exp}</p>
                    <button 
                      onClick={() => {
                        // Pre-fill doctor name and specialty (department)
                        setFormData(prev => ({
                          ...prev, 
                          doctorName: doctor.name, 
                          specialist: doctor.specialty,
                          symptom: `Consultation with ${doctor.name} - ${doctor.specialty}` // Pre-fill reason/symptom
                        }));
                        setShowAppointmentForm(true);
                      }}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-full transition duration-300"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button 
                onClick={() => setShowAppointmentForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </section>
        
        {/* Appointments Section (Updated with loading/error state and delete function) */}
        <section id="appointments" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">My <span className="text-blue-600">Appointments</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                View and manage your upcoming and past appointments.
              </p>
            </div>
            
            {loading && (
              <div className="text-center py-12 text-blue-600 font-medium">
                Loading appointments...
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-8" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            
            {!loading && !error && appointments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">No Appointments Booked Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You haven't booked any appointments yet. Book your first appointment with our expert doctors today.
                </p>
                <button 
                  onClick={() => setShowAppointmentForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Total Appointments: <span className="text-blue-600">{appointments.length}</span>
                  </h3>
                  {/* Clear All button is removed as appointments are now handled by the API/backend */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mb-2">
                              {appointment.status || 'Pending'}
                            </span>
                            <h3 className="text-lg font-bold text-gray-800">{appointment.doctorName || 'Doctor Name N/A'}</h3>
                            <p className="text-gray-600 text-sm">{appointment.specialist || 'Specialist N/A'}</p>
                          </div>
                          <button 
                            onClick={() => deleteAppointment(appointment.id)} // Calling delete function
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                           <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Patient</p>
                              <p className="font-medium">{appointment.name || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium">{appointment.date ? formatDate(appointment.date) : 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-medium">{appointment.time || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        
                        {(appointment.symptom || appointment.reason) && ( // Check both keys for flexibility
                          <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-1">Reason for Visit</p>
                            <p className="text-gray-800">{appointment.symptom || appointment.reason}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Appointment ID</p>
                            <p className="text-sm font-medium text-gray-800">{appointment.id || appointment._id || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Booked on</p>
                            <p className="text-sm font-medium text-gray-800">{appointment.bookingDate ? formatDate(appointment.bookingDate) : (appointment.createdAt ? formatDate(appointment.createdAt) : 'N/A')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setShowAppointmentForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300"
                  >
                    Book New Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Contact Section (Unchanged) */}
        <section id="contact" className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact <span className="text-blue-600">MediCare+</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get in touch with us for appointments, inquiries, or emergency services. We're here to help 24/7.
              </p>
            </div>
            
            <div className="flex justify-center gap-12">
              {/* <div className="lg:w-1/2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">First Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+1 (234) 567-8900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Message</label>
                      <textarea 
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300">
                      Send Message
                    </button>
                  </form>
                </div>
              </div> */}
              
              <div className="lg:w-1/2">
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Our Location</h4>
                          <p className="text-gray-600">123 Medical Avenue, Health City, HC 12345</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Phone Number</h4>
                          <p className="text-gray-600">Emergency: (123) 456-7890</p>
                          <p className="text-gray-600">Appointments: (123) 456-7891</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">Email Address</h4>
                          <p className="text-gray-600">info@medicareplus.com</p>
                          <p className="text-gray-600">appointments@medicareplus.com</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t">
                      <h4 className="font-bold text-gray-800 mb-4">Emergency Services</h4>
                      <p className="text-gray-600 mb-4">Our emergency department is open 24 hours a day, 7 days a week, with rapid response teams ready to assist.</p>
                      <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full transition duration-300">
                        Emergency Contact: (123) 456-7890
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Operating Hours</h3>
                    <div className="space-y-4">
                      {[
                        { day: 'Monday - Friday', time: '8:00 AM - 8:00 PM' },
                        { day: 'Saturday', time: '9:00 AM - 6:00 PM' },
                        { day: 'Sunday', time: '9:00 AM - 4:00 PM' },
                        { day: 'Emergency', time: '24/7' }
                      ].map((hour, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                          <span className="font-medium text-gray-800">{hour.day}</span>
                          <span className="text-blue-600 font-medium">{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer (Unchanged) */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">MediCare<span className="text-blue-400">+</span></h1>
                  <p className="text-gray-400 text-xs">Advanced Healthcare Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Providing exceptional healthcare services with compassion and cutting-edge technology since 2005.
              </p>
            </div>
            
            <div className="flex space-x-6">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition duration-300"
                  aria-label={social}
                >
                  <span className="font-bold">{social === 'facebook' ? 'f' : 
                                               social === 'twitter' ? 't' : 
                                               social === 'instagram' ? 'ig' : 'in'}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MediCare+ Hospital. All rights reserved.</p>
            <p className="mt-2">Uses a mock API for appointment management.</p>
          </div>
        </div>
      </footer>
      
      {/* Floating Appointment Button (Unchanged) */}
      <button 
        onClick={() => setShowAppointmentForm(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-xl z-40 flex items-center transition duration-300"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Book Appointment
      </button>
    </div>
  );
};

export default HospitalWebsite;