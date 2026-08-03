/**
 * Dhule Electrical Works - Central Business Configuration
 * Edit this single file to update business details across the entire website!
 */

const CONFIG = {
  business: {
    name: "Dhule Electrical Works",
    shortName: "Dhule Electrical",
    tagline: "24x7 Electrician Service in Dhule",
    subTagline: "Works & Services",
    ownerName: "Licensed Dhule Electrician Team",
    experienceYears: "8+",
    satisfiedCustomers: "4,500+",
    avgArrivalTime: "30-60 Mins",
    guarantee: "100% Safety & Workmanship Guarantee"
  },

  contact: {
    phone: "+918830302059",
    phoneDisplay: "+91 8830302059",
    whatsappNumber: "918830302059",
    email: "ansarisohail12527@gmail.com",
    emergencyHelpline: "+91 8830302059"
  },

  location: {
    address: "plot No. 12, Near Jama Masjid Firdos Nagar, Dhule, Maharashtra 424001, India",
    landmark: "Near Near jama masjid, Firdos Nagar,Dhule",
    city: "Dhule",
    state: "Maharashtra",
    pincode: "424001",
    coverageAreas: [
      "Deopur",
      "Sakri Road",
      "Mohadi",
      "Parola Road",
      "Agra Road",
      "Awadhan MIDC",
      "Chittod Road",
      "Walwadi",
      "Nakane Road",
      "Gondur"
    ],
    googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59585.1228221876!2d74.74088805!3d20.9042299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdec59124430f81%3A0x67dbef91c85d774!2sDhule%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },

  businessHours: {
    days: "Monday - Sunday",
    time: "24 Hours Open",
    status: "24x7 On Standby in Dhule",
    responseTime: "30 - 60 Minutes"
  },

  adminPassword: "@nsariZiyan88",

  socialMedia: {
    whatsapp: "https://wa.me/918830302059",
    facebook: "https://facebook.com/dhuleelectrical",
    instagram: "https://instagram.com/dhuleelectrical",
    googleBusiness: "https://maps.google.com/?q=Dhule+Electrical+Works"
  },

  pricing: {
    baseRates: {
      'wiring': 250,        // ₹250 per point
      'light-fan': 150,     // ₹150 per fitting
      'mcb': 300,           // ₹300 per unit
      'inverter': 700,      // ₹700 fixed + base
      'motor': 450,          // ₹450 fixed
      'repair': 200          // ₹200 inspection
    }
  },

  gallery: [
    {
      id: "gal-1",
      title: "Modular Switchboard & LED Profile",
      location: "Residential Home • Deopur, Dhule",
      image: "/assets/images/electrician_work.jpg"
    },
    {
      id: "gal-2",
      title: "3-Phase Distribution Board",
      location: "Commercial Showroom • Sakri Road",
      image: "https://picsum.photos/seed/mcb-panel/800/600"
    },
    {
      id: "gal-3",
      title: "Dual Battery Inverter Backup",
      location: "Residence • Mohadi, Dhule",
      image: "https://picsum.photos/seed/inverter-battery/800/600"
    },
    {
      id: "gal-4",
      title: "Water Pump Motor Starter Panel",
      location: "Agricultural Setup • Parola Road",
      image: "https://picsum.photos/seed/motor-starter-panel/800/600"
    }
  ],

  reviews: [
    {
      id: "rev-1",
      name: "Sanjay Ahirrao",
      location: "Deopur, Dhule • Verified Customer",
      stars: 5,
      comment: "Our main switchboard started sparking late at night around 11 PM in Deopur. Called Dhule Electrical Works and their electrician arrived within 20 minutes with a spare RCCB. Solved the problem safely!"
    },
    {
      id: "rev-2",
      name: "Ramesh Chaudhari",
      location: "Sakri Road, Dhule • Homeowner",
      stars: 5,
      comment: "Got complete concealed house wiring done for our newly built bungalow on Sakri Road. Excellent wire dressing, branded Havells cables used, and very reasonable rates."
    },
    {
      id: "rev-3",
      name: "Pravin Bhamare",
      location: "Mohadi, Dhule • Shop Owner",
      stars: 5,
      comment: "Inverter and water pump motor starter wiring was completed in 1 hour flat. Polite behavior, clean work without mess. Highly recommended in Dhule!"
    }
  ],

  services: [
    {
      id: 'house-wiring',
      title: 'House Wiring',
      category: 'residential',
      icon: 'fa-house-plug',
      price: '₹2,499 onwards',
      tag: 'Full & Partial',
      desc: 'Complete concealed, surface, or PVC casing house wiring with fire-retardant copper cables and safety insulation for new & renovated homes.'
    },
    {
      id: 'electrical-repair',
      title: 'Electrical Repair',
      category: 'emergency',
      icon: 'fa-screwdriver-wrench',
      price: '₹199 onwards',
      tag: '24x7 Quick Fix',
      desc: 'Instant troubleshooting for short circuits, power outages, sparking outlets, blown fuses, and loose electrical connections.'
    },
    {
      id: 'fan-installation',
      title: 'Fan Installation',
      category: 'residential',
      icon: 'fa-fan',
      price: '₹149 per fan',
      tag: 'Ceiling & Exhaust',
      desc: 'Safe mounting and wiring of ceiling fans, wall fans, exhaust fans, and designer chandeliers with regulator alignment.'
    },
    {
      id: 'light-installation',
      title: 'Light Installation',
      category: 'residential',
      icon: 'fa-lightbulb',
      price: '₹99 per fitting',
      tag: 'LED & Decorative',
      desc: 'Installation of LED tube lights, profile lights, false ceiling spotlights, decorative strip lighting, and outdoor flood lights.'
    },
    {
      id: 'mcb-installation',
      title: 'MCB Installation',
      category: 'emergency',
      icon: 'fa-toggle-on',
      price: '₹299 onwards',
      tag: 'Safety Circuit',
      desc: 'Single, double, and triple pole MCB installation to safeguard your appliances against sudden overloads and voltage spikes.'
    },
    {
      id: 'rccb-installation',
      title: 'RCCB Installation',
      category: 'emergency',
      icon: 'fa-shield-halved',
      price: '₹699 onwards',
      tag: 'Shock Protection',
      desc: 'Residual Current Circuit Breaker fitting for 100% human shock protection and earth leakage detection in homes and offices.'
    },
    {
      id: 'distribution-board',
      title: 'Distribution Board',
      category: 'commercial',
      icon: 'fa-boxes-stacked',
      price: '₹1,199 onwards',
      tag: 'Single & 3-Phase',
      desc: 'Main distribution board (DB) dressing, busbar box installation, phase selector switch, and load balance wiring.'
    },
    {
      id: 'inverter-setup',
      title: 'Inverter Installation',
      category: 'residential',
      icon: 'fa-battery-full',
      price: '₹499 onwards',
      tag: 'Power Backup',
      desc: 'Home & shop inverter wiring, dual battery connection, main switch bypass setup, and load separation for seamless power backup.'
    },
    {
      id: 'ups-installation',
      title: 'UPS System Setup',
      category: 'commercial',
      icon: 'fa-server',
      price: '₹799 onwards',
      tag: 'Clean Power',
      desc: 'Online & offline UPS wiring for computers, servers, medical equipment, and office machinery with surge suppressors.'
    },
    {
      id: 'water-pump',
      title: 'Water Pump Repair & Wiring',
      category: 'residential',
      icon: 'fa-water',
      price: '₹349 onwards',
      tag: 'Submersible & Monoblock',
      desc: 'Submersible motor connection, automatic water level controller wiring, capacitor replacement, and pressure pump fitting.'
    },
    {
      id: 'motor-starter',
      title: 'Motor Starter Wiring',
      category: 'commercial',
      icon: 'fa-gears',
      price: '₹449 onwards',
      tag: 'Agricultural & Commercial',
      desc: 'DOL and Star-Delta motor starter panel installation, thermal overload relay adjustment, and auto-switch fitting.'
    },
    {
      id: 'earthing-service',
      title: 'Chemical Earthing',
      category: 'emergency',
      icon: 'fa-bolt',
      price: '₹1,499 onwards',
      tag: 'Safety Spike',
      desc: 'Plate earthing, GI pipe earthing, and chemical compound earthing for shock prevention and heavy electrical load grounding.'
    },
    {
      id: 'cctv-wiring',
      title: 'CCTV Camera Wiring',
      category: 'commercial',
      icon: 'fa-video',
      price: '₹249 per camera point',
      tag: 'Security Systems',
      desc: 'HD coaxial and LAN cabling for CCTV cameras, DVR/NVR power adapter wiring, and neat conduit routing.'
    },
    {
      id: 'door-bell',
      title: 'Door Bell Fitting',
      category: 'residential',
      icon: 'fa-bell',
      price: '₹149 onwards',
      tag: 'Wired & Wireless',
      desc: 'Musical door bell, video door phone (VDP), and smart wireless doorbell installation with weather-proof outdoor switches.'
    },
    {
      id: 'switch-board',
      title: 'Switch Board Repair & Modular Fitting',
      category: 'residential',
      icon: 'fa-sliders',
      price: '₹199 per board',
      tag: 'Modular & Conventional',
      desc: 'Fitting 2 to 18-module touch and rocker switchboards, replacing broken switches, regulators, and USB wall sockets.'
    },
    {
      id: 'outdoor-lighting',
      title: 'Outdoor & Garden Lighting',
      category: 'residential',
      icon: 'fa-sun',
      price: '₹599 onwards',
      tag: 'Waterproof Fixtures',
      desc: 'Gate light, garden spike light, building facade LED strip, and motion sensor floodlight installation with waterproof cabling.'
    },
    {
      id: 'commercial-wiring',
      title: 'Commercial & Industrial Wiring',
      category: 'commercial',
      icon: 'fa-building-user',
      price: 'Custom Quote',
      tag: 'Heavy Load Systems',
      desc: '3-phase industrial wiring, cable tray layout, factory panel board installation, and transformer earthing for shops & industries in Dhule.'
    }
  ]
};
