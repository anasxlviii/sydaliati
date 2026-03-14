// --- State & Dynamic Data ---
let mockPharmacies = [];

// Fetch data on load
fetch('./pharmacies.json')
    .then(response => response.json())
    .then(data => { mockPharmacies = data; })
    .catch(error => console.error('Error loading pharmacies list:', error));

const emergenciesData = [
    { name: "Police Secours", desc: "Urgences Policières / Sécurité", phone: "19", icon: "fa-shield-halved", color: "icon-blue" },
    { name: "Police Mobile", desc: "Depuis un téléphone portable", phone: "190", icon: "fa-mobile-screen", color: "icon-blue" },
    { name: "Sapeurs Pompiers", desc: "Incendies / Accidents", phone: "15", icon: "fa-fire-extinguisher", color: "icon-red" },
    { name: "Ambulance / SAMU", desc: "Urgences Médicales", phone: "150", icon: "fa-truck-medical", color: "icon-red" },
    { name: "Gendarmerie Royale", desc: "Sécurité hors zone urbaine", phone: "177", icon: "fa-building-shield", color: "icon-purple" }
];

const labsData = [
    { name: "Laboratoire Abdelmoumen", desc: "8, Rue Jakarta (face Lycée Abdelmoumen)", phone: "0536687474", icon: "fa-flask", color: "icon-green" },
    { name: "Laboratoire Elqods", desc: "Quartier Al Qods", phone: "0536687396", icon: "fa-flask", color: "icon-green" },
    { name: "Laboratoire Oujda", desc: "Bd Idriss Alakbar imm. Boukarabila", phone: "0536683068", icon: "fa-flask-vial", color: "icon-green" },
    { name: "Laboratoire Aarab", desc: "Analyses Médicales Générales", phone: "0536681026", icon: "fa-microscope", color: "icon-green" }
];

const doctorsData = [
    { name: "Hôpital Al Farabi", specialty: "General", desc: "Centre Hospitalier - Urgences 24/7", phone: "0536682705", icon: "fa-hospital", color: "icon-blue" },
    { name: "CHU Mohammed VI", specialty: "General", desc: "Hôpital Universitaire", phone: "0536539100", icon: "fa-hospital", color: "icon-blue" },
    { name: "Dr. Faiza DAOUDI", specialty: "General", desc: "Médecin Généraliste", phone: "0536000001", icon: "fa-user-doctor", color: "icon-purple" },
    { name: "Dr. Aicha HOUTI", specialty: "General", desc: "Médecin Généraliste", phone: "0536000002", icon: "fa-user-doctor", color: "icon-purple" },
    { name: "Dr Ahmed Oulad", specialty: "Cardiology", desc: "Cardiologue Spécialiste", phone: "0536000003", icon: "fa-heart-pulse", color: "icon-red" },
    { name: "Dr Fatima Zohra", specialty: "Dermatology", desc: "Dermatologue", phone: "0536000004", icon: "fa-hand-dots", color: "icon-green" },
    { name: "Dr Said Benali", specialty: "Pediatrics", desc: "Pédiatre", phone: "0536000005", icon: "fa-baby", color: "icon-blue" },
    { name: "Dr Youssef Alaoui", specialty: "Dentist", desc: "Chirurgien Dentiste", phone: "0536000006", icon: "fa-tooth", color: "icon-purple" },
    { name: "Clinique Pasteur", specialty: "Psychiatry", desc: "Santé Mentale", phone: "0536000007", icon: "fa-brain", color: "icon-blue" }
];

// --- DOM Elements ---
// Navigation
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');
const appTitle = document.getElementById('app-title');
const appSubtitle = document.getElementById('app-subtitle');

// Profile Auth Forms
const loginTabs = document.querySelectorAll('.login-tab');
const authForms = document.querySelectorAll('.auth-form');

// Pharmacies Features
const locateBtn = document.getElementById('locate-btn');
const statusMsg = document.getElementById('status-message');
const resultsContainer = document.getElementById('results-container');
const pharmacyList = document.getElementById('pharmacy-list');
const resultsCount = document.getElementById('results-count');
const pharmacyTemplate = document.getElementById('pharmacy-card-template');

// Tools Features
const toolPills = document.querySelectorAll('.tool-pill');
const dirSections = document.querySelectorAll('.directory-section');
const dirTemplate = document.getElementById('directory-card-template');
const specialtyFilter = document.getElementById('specialty-filter');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAuthForms();
    initTools();
    
    // Attach event for pharmacy locator
    if (locateBtn) {
        locateBtn.addEventListener('click', requestLocation);
    }
});

// --- App Logic: Tools Directory ---
function initTools() {
    // Sub-nav tab switching
    toolPills.forEach(pill => {
        pill.addEventListener('click', () => {
            toolPills.forEach(p => p.classList.remove('active'));
            dirSections.forEach(s => s.classList.add('hidden'));
            
            pill.classList.add('active');
            const target = pill.getAttribute('data-directory');
            const targetSection = document.getElementById(`dir-${target}`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });

    // Specialty filter for Doctors
    specialtyFilter.addEventListener('change', (e) => {
        const selected = e.target.value;
        const filteredDocs = selected === 'all' 
            ? doctorsData 
            : doctorsData.filter(d => d.specialty === selected);
        renderDirectoryCards(filteredDocs, 'doctors-grid');
    });

    // Initial render
    renderDirectoryCards(emergenciesData, 'emergencies-grid');
    renderDirectoryCards(labsData, 'labs-grid');
    renderDirectoryCards(doctorsData, 'doctors-grid');
}

function renderDirectoryCards(dataArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    dataArray.forEach((item, index) => {
        const clone = dirTemplate.content.cloneNode(true);
        const card = clone.querySelector('.directory-card');
        card.style.animationDelay = `${index * 0.05}s`;

        const iconBox = clone.querySelector('.dir-icon-box');
        iconBox.classList.add(item.color || 'icon-blue');
        
        const icon = clone.querySelector('.dir-icon');
        icon.classList.add(item.icon || 'fa-phone');

        clone.querySelector('.dir-title').textContent = item.name;
        clone.querySelector('.dir-subtitle').textContent = item.desc;
        
        const btn = clone.querySelector('.dir-action-btn');
        btn.href = `tel:${item.phone}`;

        container.appendChild(clone);
    });
}

// --- App Logic: Navigation (SPA Routing) ---
function initNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.classList.add('hidden');
            });

            item.classList.add('active');
            const targetId = item.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.remove('hidden');
                // Force reflow for fade-in animation
                void targetPane.offsetWidth;
                targetPane.classList.add('active');
            }

            switch(targetId) {
                case 'view-pharmacies':
                    appTitle.textContent = "Sydalty";
                    appSubtitle.textContent = "Oujda Local Services";
                    break;
                case 'view-tools':
                    appTitle.textContent = "Medical Directory";
                    appSubtitle.textContent = "Urgences, Docs & Labs";
                    break;
                case 'view-profile':
                    appTitle.textContent = "My Profile";
                    appSubtitle.textContent = "Manage Account & Preferences";
                    break;
            }
        });
    });
}

// --- App Logic: Auth Forms Switching ---
function initAuthForms() {
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            loginTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.add('hidden'));

            tab.classList.add('active');
            const targetFormId = tab.getAttribute('data-target');
            document.getElementById(targetFormId).classList.remove('hidden');
        });
    });
}

// --- App Logic: Pharmacies Locator ---
function requestLocation() {
    setStatus("");
    resultsContainer.classList.add('hidden');
    pharmacyList.innerHTML = '';

    if (mockPharmacies.length === 0) {
        setStatus("Pharmacies list is still loading or failed. Please refresh.", true);
        return;
    }
    
    if (!navigator.geolocation) {
        setStatus("Geolocation is not supported by your browser.", true);
        return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            processLocation(userLat, userLng);
        },
        error => {
            setLoading(false);
            let msg = "Unable to retrieve your location.";
            if (error.code === 1) msg = "Please allow location access to find nearby pharmacies.";
            setStatus(msg, true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function processLocation(userLat, userLng) {
    const pharmaciesWithDistance = mockPharmacies.map(pharmacy => ({
        ...pharmacy,
        distance: haversineDistance(userLat, userLng, pharmacy.lat, pharmacy.lng)
    }));

    pharmaciesWithDistance.sort((a, b) => a.distance - b.distance);
    renderPharmacies(pharmaciesWithDistance);
    
    setLoading(false);
    resultsContainer.classList.remove('hidden');
}

function renderPharmacies(pharmacies) {
    resultsCount.textContent = `${pharmacies.length} found`;
    
    pharmacies.forEach((pharmacy, index) => {
        const clone = pharmacyTemplate.content.cloneNode(true);
        const card = clone.querySelector('.pharmacy-card');
        card.style.animationDelay = `${index * 0.1}s`;
        
        clone.querySelector('.pharmacy-name').textContent = pharmacy.name;
        clone.querySelector('.address-text').textContent = pharmacy.address;
        
        let distanceText = "";
        if (pharmacy.distance < 1) distanceText = `${Math.round(pharmacy.distance * 1000)} m away`;
        else distanceText = `${pharmacy.distance.toFixed(1)} km away`;
        clone.querySelector('.distance-value').textContent = distanceText;
        
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
        clone.querySelector('.direction-link').href = mapsUrl;

        pharmacyList.appendChild(clone);
    });
}

// --- Utils ---
function setLoading(isLoading) {
    if (isLoading) {
        locateBtn.classList.add('loading');
        locateBtn.querySelector('span').textContent = 'Finding...';
        locateBtn.querySelector('i').className = 'fa-solid fa-circle-notch';
        locateBtn.disabled = true;
    } else {
        locateBtn.classList.remove('loading');
        locateBtn.querySelector('span').textContent = 'Find Nearest Pharmacy';
        locateBtn.querySelector('i').className = 'fa-solid fa-location-crosshairs';
        locateBtn.disabled = false;
    }
}

function setStatus(msg, isError = false) {
    if (!msg) {
        statusMsg.classList.add('hidden');
        statusMsg.classList.remove('error');
        return;
    }
    statusMsg.textContent = msg;
    statusMsg.classList.remove('hidden');
    if (isError) statusMsg.classList.add('error');
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI/180);
    const dLon = (lon2 - lon1) * (Math.PI/180); 
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
}
