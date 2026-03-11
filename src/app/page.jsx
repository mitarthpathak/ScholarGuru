"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/utils/authService";

export default function HomePage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSignInRequired, setShowSignInRequired] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signInError, setSignInError] = useState("");

  const { user, isLoggedIn, signIn, signOut } = useAuth();

  const handleStartConsultation = () => {
    if (isLoggedIn) {
      window.location.href = '/chat';
    } else {
      setShowSignInRequired(true);
    }
  };

  const scrollToServices = (e) => {
    e.preventDefault();
    const servicesSection = document.getElementById("services");
    servicesSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGetStartedSubmit = (e) => {
    e.preventDefault();
    setSignUpError("");

    // Validate password
    if (!password || password.trim().length < 6) {
      setSignUpError("Password must be at least 6 characters long");
      return;
    }

    const newUser = {
      fullName,
      username,
      email,
      age,
      phone,
    };

    // Register the user
    const result = authService.register(email, password, newUser);

    if (!result.success) {
      setSignUpError(result.error);
      return;
    }

    // Sign in the user
    signIn(result.user);
    setShowGetStarted(false);
    // Reset form fields
    setFullName("");
    setUsername("");
    setEmail("");
    setAge("");
    setPhone("");
    setPassword("");
    // Navigate to chat
    window.location.href = "/chat";
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setSignInError("");

    if (!signInEmail || !signInPassword) {
      setSignInError("Please enter email and password");
      return;
    }

    // Try to sign in with credentials
    const result = authService.signInWithCredentials(signInEmail, signInPassword);

    if (!result.success) {
      setSignInError(result.error);
      return;
    }

    // Sign in successful
    signIn(result.user);
    setShowSignIn(false);
    setSignInEmail("");
    setSignInPassword("");
  };

  const handleSignOut = () => {
    setShowUserProfile(false);
    setShowLogoutConfirm(true);
  };

  const confirmSignOut = () => {
    signOut();
    setShowLogoutConfirm(false);
  };

  const services = [
    {
      title: "Instant Health Queries",
      icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      color: "blue",
      description:
        "Get immediate answers to your health-related questions from our AI assistant",
      details:
        "Our AI-powered chatbot provides instant responses to your health queries 24/7. Whether you have questions about symptoms, medications, or general wellness, our intelligent system analyzes your questions and provides accurate, reliable information in seconds. The system is trained on vast medical databases and continuously updated with the latest health information to ensure you receive the most current guidance.",
    },
    {
      title: "Symptom Analysis",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "green",
      description:
        "Describe your symptoms and get preliminary guidance on possible conditions",
      details:
        "Our advanced symptom checker uses sophisticated AI algorithms to analyze your symptoms and provide preliminary insights into possible health conditions. Simply describe what you're experiencing, and our system will ask relevant follow-up questions to better understand your situation. While this doesn't replace professional medical advice, it helps you understand when to seek medical attention and what questions to ask your doctor.",
    },
    {
      title: "Health Education",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "purple",
      description:
        "Learn about diseases, medications, and preventive care measures",
      details:
        "Access a comprehensive library of health information covering diseases, medications, preventive care, and wellness topics. Our educational resources are curated by medical professionals and presented in easy-to-understand language. Learn about nutrition, exercise, mental health, chronic disease management, and much more. Stay informed about the latest health trends and evidence-based practices to maintain optimal health.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sagacity</h1>
              <p className="text-xs text-blue-300">Health Assistance</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              className="text-sm text-gray-300 hover:text-blue-400 transition-all duration-300"
            >
              Home
            </a>
            <a
              href="#services"
              onClick={scrollToServices}
              className="text-sm text-gray-300 hover:text-blue-400 transition-all duration-300"
            >
              Services
            </a>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-sm text-gray-300 hover:text-blue-400 transition-all duration-300"
            >
              How It Works
            </button>
            <button
              onClick={() => setShowAboutUs(true)}
              className="text-sm text-gray-300 hover:text-blue-400 transition-all duration-300"
            >
              About Us
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/50 hover:shadow-green-500/70 hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {user.fullName || user.username}
                </button>

                {showUserProfile && (
                  <div className="absolute right-0 top-12 bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-lg p-4 shadow-xl shadow-blue-500/20 z-50 min-w-64">
                    <div className="mb-4">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-white font-semibold">{user.fullName || user.username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      {user.age && (
                        <p className="text-sm text-gray-400">Age: {user.age}</p>
                      )}
                      {user.phone && (
                        <p className="text-sm text-gray-400">Phone: {user.phone}</p>
                      )}
                    </div>
                    <div className="border-t border-blue-500/30 pt-3 space-y-2">
                      <button
                        onClick={() => {
                          setShowUserProfile(false);
                          window.location.href = "/chat";
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-blue-500/20 rounded transition-colors"
                      >
                        Go to Chat
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="px-5 py-2 text-sm text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-all duration-300 border border-transparent hover:border-blue-500/50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowGetStarted(true)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900/50 via-gray-900/50 to-blue-900/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Government Certified Health Platform
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Real-Time Health Assistance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                When You Need It Most
              </span>
            </h2>

            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Get instant, AI-powered health guidance 24/7. Our certified
              platform connects you with reliable health information in
              real-time, ensuring you're never alone in your health journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={handleStartConsultation}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                Start Free Consultation
              </button>
              <button
                onClick={() => setShowAboutUs(true)}
                className="px-8 py-4 bg-gray-800/50 text-white text-base font-semibold rounded-xl hover:bg-gray-700/50 transition-all duration-300 border-2 border-blue-500/30 hover:border-blue-500/50 backdrop-blur-sm hover:scale-105"
              >
                Learn More
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-blue-500/30 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/50">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  24/7 Available
                </h3>
                <p className="text-sm text-gray-400">
                  Always here when you need us
                </p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg border border-green-500/20 backdrop-blur-sm hover:border-green-500/50 transition-all duration-500 hover:scale-105 hover:shadow-green-500/30 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-green-500/50">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                  &lt;2 min Response Time
                </h3>
                <p className="text-sm text-gray-400">
                  Quick and reliable answers
                </p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/50">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  100% Secure
                </h3>
                <p className="text-sm text-gray-400">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Our Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive health assistance powered by AI and backed by
              medical expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => setShowServiceModal(service)}
                className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-xl hover:from-${service.color}-900/50 hover:to-gray-800/50 transition-all duration-500 border border-${service.color}-500/10 hover:border-${service.color}-500/30 backdrop-blur-sm cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-${service.color}-500/20`}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br from-${service.color}-500 to-${service.color}-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-${service.color}-500/50`}
                >
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={service.icon}
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold mb-3 text-white group-hover:text-${service.color}-400 transition-colors duration-300`}
                >
                  {service.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950/50 border-t border-blue-800/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-white">Sagacity</span>
              </div>
              <p className="text-sm text-gray-400">
                Real-time health assistance you can trust
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="/"
                    onClick={scrollToTop}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setShowServiceModal(services[0])}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowAboutUs(true)}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => setShowHowItWorks(true)}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowTermsOfService(true)}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="mailto:mpathak6207@gmail.com"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    mpathak6207@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:9587507407"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    9587507407
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800/30 pt-8 text-center text-sm text-gray-500">
            <p>
              &copy; 2025 Sagacity Health Assistance. All rights reserved. |
              Government of India Initiative
            </p>
          </div>
        </div>
      </footer>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowHowItWorks(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-3xl w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                How Sagacity AI Works
              </h3>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    AI-Powered Analysis
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Our advanced AI system analyzes your health queries using
                    state-of-the-art natural language processing and vast
                    medical databases to provide accurate, evidence-based
                    responses.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/50">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    100% Accuracy Commitment
                  </h4>
                  <p className="text-gray-300 text-sm">
                    We ensure the highest level of accuracy by cross-referencing
                    multiple medical sources and employing continuous learning
                    algorithms. Our AI is regularly updated with the latest
                    medical research and guidelines.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Complete Anonymity
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Your privacy is our top priority. All conversations are
                    encrypted end-to-end, and we never store personally
                    identifiable information. Your health queries remain
                    completely anonymous and secure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/50">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Instant Response
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Get answers in under 2 minutes. Our optimized infrastructure
                    ensures rapid processing while maintaining the highest
                    quality of health guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300 text-center">
                <strong>Disclaimer:</strong> Sagacity AI provides health
                information and guidance but does not replace professional
                medical advice. Always consult with healthcare professionals for
                serious health concerns.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutUs && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAboutUs(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">About Sagacity</h3>
              <button
                onClick={() => setShowAboutUs(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                Sagacity is a revolutionary AI-powered health assistance
                platform developed as a Government of India initiative to
                provide accessible, reliable, and instant health guidance to
                citizens across the nation.
              </p>

              <p className="leading-relaxed">
                Our mission is to democratize healthcare information and make
                quality health guidance available to everyone, anytime,
                anywhere. We believe that informed individuals make better
                health decisions.
              </p>

              <p className="leading-relaxed">
                Powered by cutting-edge artificial intelligence and backed by
                extensive medical databases, Sagacity offers 24/7 health
                assistance with complete anonymity and data security.
              </p>

              <p className="leading-relaxed">
                We work closely with medical professionals, researchers, and
                technology experts to ensure our platform delivers accurate,
                up-to-date, and trustworthy health information.
              </p>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Vision:</strong> To become India's most trusted AI
                  health companion, empowering millions with instant access to
                  reliable health information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignIn(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Sign In</h3>
              <button
                onClick={() => setShowSignIn(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                Sign In
              </button>

              <p className="text-sm text-gray-400 text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Get Started Modal */}
      {showGetStarted && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowGetStarted(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-4xl w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Get Started with Sagacity
              </h3>
              <button
                onClick={() => setShowGetStarted(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleGetStartedSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="johndoe123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy. Your data is encrypted and secure.
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                Start Your Health Journey
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {showServiceModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowServiceModal(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-3xl w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-${showServiceModal.color}-500 to-${showServiceModal.color}-600 rounded-lg flex items-center justify-center shadow-lg shadow-${showServiceModal.color}-500/50`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={showServiceModal.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {showServiceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setShowServiceModal(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              {showServiceModal.details}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowServiceModal(null);
                  setShowGetStarted(true);
                }}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-${showServiceModal.color}-500 to-${showServiceModal.color}-600 text-white font-semibold rounded-lg hover:from-${showServiceModal.color}-600 hover:to-${showServiceModal.color}-700 transition-all duration-300 shadow-lg shadow-${showServiceModal.color}-500/50 hover:shadow-${showServiceModal.color}-500/70 hover:scale-105`}
              >
                Try This Service
              </button>
              <button
                onClick={() => setShowServiceModal(null)}
                className="px-6 py-3 bg-gray-800/50 text-white font-semibold rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignIn(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Sign In</h3>
              <button
                onClick={() => {
                  setShowSignIn(false);
                  setSignInError("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {signInError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-300">{signInError}</p>
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => {
                    setSignInEmail(e.target.value);
                    setSignInError("");
                  }}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => {
                    setSignInPassword(e.target.value);
                    setSignInError("");
                  }}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                Sign In
              </button>

              <p className="text-sm text-gray-400 text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowSignIn(false);
                    setShowGetStarted(true);
                    setSignInError("");
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Get Started (Sign Up) Modal */}
      {showGetStarted && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowGetStarted(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-5xl w-full p-8 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Get Started with Sagacity
              </h3>
              <button
                onClick={() => {
                  setShowGetStarted(false);
                  setSignUpError("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {signUpError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-300">{signUpError}</p>
              </div>
            )}

            <form onSubmit={handleGetStartedSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setSignUpError("");
                    }}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setSignUpError("");
                    }}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="johndoe123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      setSignUpError("");
                    }}
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setSignUpError("");
                    }}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSignUpError("");
                  }}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSignUpError("");
                  }}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a strong password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                Create Account
              </button>

              <p className="text-sm text-gray-400 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowGetStarted(false);
                    setShowSignIn(true);
                    setSignUpError("");
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-400">
                Do you really want to sign out? You'll need to sign in again to access your chats.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800/50 text-white font-semibold rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Required Modal */}
      {showSignInRequired && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignInRequired(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Sign In Required
              </h3>
              <p className="text-gray-400">
                Please sign in first to use the chatbot and start your free consultation.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSignInRequired(false)}
                className="flex-1 px-4 py-2 bg-gray-800/50 text-white font-semibold rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignInRequired(false);
                  setShowSignIn(true);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrivacyPolicy(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Privacy Policy
              </h3>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-gray-300 space-y-4 max-h-96 overflow-y-auto pr-2">
              <h4 className="text-lg font-semibold text-white mb-3">Information We Collect</h4>
              <p className="text-sm leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                use our chat services, or contact us for support. This includes your name, email address, 
                age, and other information you choose to provide.
              </p>

              <h4 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h4>
              <p className="text-sm leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, including:
                • Personalizing your experience<br/>
                • Communicating with you<br/>
                • Analyzing usage patterns<br/>
                • Providing customer support
              </p>

              <h4 className="text-lg font-semibold text-white mb-3">Information Sharing</h4>
              <p className="text-sm leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>

              <h4 className="text-lg font-semibold text-white mb-3">Data Security</h4>
              <p className="text-sm leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized 
                access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTermsOfService(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Terms of Service
              </h3>
              <button
                onClick={() => setShowTermsOfService(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-gray-300 space-y-4 max-h-96 overflow-y-auto pr-2">
              <h4 className="text-lg font-semibold text-white mb-3">Acceptance of Terms</h4>
              <p className="text-sm leading-relaxed">
                By accessing and using Sagacity AI Health Assistant, you accept and agree to be bound 
                by the terms and provision of this agreement.
              </p>

              <h4 className="text-lg font-semibold text-white mb-3">Use of Service</h4>
              <p className="text-sm leading-relaxed">
                Our service provides AI-powered health information and guidance. This is not a substitute 
                for professional medical advice, diagnosis, or treatment.
              </p>

              <h4 className="text-lg font-semibold text-white mb-3">User Responsibilities</h4>
              <p className="text-sm leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for 
                all activities that occur under your account.
              </p>

              <h4 className="text-lg font-semibold text-white mb-3">Medical Disclaimer</h4>
              <p className="text-sm leading-relaxed">
                The information provided is for educational purposes only and should not be used as 
                a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTermsOfService(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
