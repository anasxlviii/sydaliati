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

const langToggle = document.getElementById('lang-toggle');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize translations to default
    setLanguage('fr');
    
    initNavigation();
    initAuthForms();
    initTools();
    
    // Attach event for pharmacy locator
    if (locateBtn) {
        locateBtn.addEventListener('click', requestLocation);
    }
    
    // Attach event for language toggle
    if (langToggle) {
        langToggle.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
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

    // BMI Calculator Logic
    const btnCalcBmi = document.getElementById('btn-calc-bmi');
    if (btnCalcBmi) {
        btnCalcBmi.addEventListener('click', () => {
            const weight = parseFloat(document.getElementById('bmi-weight').value);
            const heightCm = parseFloat(document.getElementById('bmi-height').value);
            const resultDiv = document.getElementById('bmi-result');

            if (!weight || !heightCm) {
                resultDiv.textContent = currentLang === 'darija' ? "Khessek dkhl m3lomat" : "Veuillez remplir les deux champs.";
                resultDiv.style.backgroundColor = "#FEF2F2";
                resultDiv.style.color = "#EF4444";
                resultDiv.classList.remove('hidden');
                return;
            }

            const heightM = heightCm / 100;
            const bmi = weight / (heightM * heightM);
            let category = "";
            let color = "";
            let bgColor = "";

            if (bmi < 18.5) {
                category = currentLang === 'darija' ? "Nqess Fl Wzn (Maigreur)" : "Insuffisance pondérale";
                color = "#EAB308"; bgColor = "#FEFCE8";
            } else if (bmi < 25) {
                category = currentLang === 'darija' ? "Wzn Mzyan (Normal)" : "Poids normal";
                color = "#22C55E"; bgColor = "#F0FDF4";
            } else if (bmi < 30) {
                category = currentLang === 'darija' ? "Zayd shwia fl Wzn (Surpoids)" : "Surpoids";
                color = "#F97316"; bgColor = "#FFF7ED";
            } else {
                category = currentLang === 'darija' ? "Smen (Obésité)" : "Obésité";
                color = "#EF4444"; bgColor = "#FEF2F2";
            }

            resultDiv.innerHTML = `IMC: ${bmi.toFixed(1)} <br/> <span style="font-size: 14px; opacity: 0.9;">${category}</span>`;
            resultDiv.style.color = color;
            resultDiv.style.backgroundColor = bgColor;
            resultDiv.classList.remove('hidden');
        });
    }

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
                    appTitle.textContent = "SYDALIATI";
                    appSubtitle.textContent = t("subtitle_local_services");
                    break;
                case 'view-tools':
                    appTitle.textContent = t("tools_directory_title");
                    appSubtitle.textContent = t("pill_emergencies") + ", " + t("pill_doctors") + ' & Labos';
                    break;
                case 'view-profile':
                    appTitle.textContent = t("tab_profile");
                    appSubtitle.textContent = t("settings_language") + ' & Sync';
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

// --- Google Sign-In Logic ---
window.handleCredentialResponse = function(response) {
    // Decode the JWT Payload to get user info
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Hide Auth forms & dividers
    document.querySelector('.g_id_signin').classList.add('hidden');
    document.getElementById('auth-divider').classList.add('hidden');
    document.querySelector('.login-tabs').classList.add('hidden');
    authForms.forEach(f => f.classList.add('hidden'));

    // Populate user data
    document.getElementById('user-name').textContent = responsePayload.name;
    document.getElementById('user-email').textContent = responsePayload.email;
    document.getElementById('user-avatar').src = responsePayload.picture;
    
    // Show logged-in profile container
    document.getElementById('user-profile-data').classList.remove('hidden');
};

window.signOut = function() {
    // Hide user data
    document.getElementById('user-profile-data').classList.add('hidden');
    
    // Show Auth forms
    document.querySelector('.g_id_signin').classList.remove('hidden');
    document.getElementById('auth-divider').classList.remove('hidden');
    document.querySelector('.login-tabs').classList.remove('hidden');
    
    // Reset to phone form active
    loginTabs[0].click();
};

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// --- App Logic: Pharmacies Locator ---
function requestLocation() {
    setStatus("");
    resultsContainer.classList.add('hidden');
    pharmacyList.innerHTML = '';

    if (mockPharmacies.length === 0) {
        setStatus(t('error_list_loading'), true);
        return;
    }
    
    if (!navigator.geolocation) {
        setStatus(t('errorLine_geolocation'), true);
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
            let msg = t('error_location_general');
            if (error.code === 1) msg = t('error_location_denied');
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
        if (pharmacy.distance < 1) distanceText = `${Math.round(pharmacy.distance * 1000)} m ${currentLang === 'darija' ? '' : 'away'}`;
        else distanceText = `${pharmacy.distance.toFixed(1)} km ${currentLang === 'darija' ? '' : 'away'}`;
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
        locateBtn.querySelector('span').textContent = t('btn_finding');
        locateBtn.querySelector('i').className = 'fa-solid fa-circle-notch';
        locateBtn.disabled = true;
    } else {
        locateBtn.classList.remove('loading');
        locateBtn.querySelector('span').textContent = t('btn_find_pharmacy');
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
