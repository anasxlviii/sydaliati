const translations = {
    "fr": {
        "subtitle_local_services": "Services Locaux Oujda",
        "tab_pharmacies": "Pharmacies",
        "tab_tools": "Boîte à outils",
        "tab_profile": "Mon Profil",
        "tools_directory_title": "Annuaire Médical",
        "tools_directory_desc": "Accès rapide aux numéros d'urgence, médecins et laboratoires de Oujda.",
        "btn_find_pharmacy": "Trouver la pharmacie la plus proche",
        "btn_finding": "Recherche en cours...",
        "error_list_loading": "La liste des pharmacies est en cours de chargement ou a échoué. Veuillez rafraîchir.",
        "errorLine_geolocation": "La géolocalisation n'est pas supportée par votre navigateur.",
        "error_location_denied": "Veuillez autoriser l'accès à la localisation pour trouver les pharmacies à proximité.",
        "error_location_general": "Impossible de récupérer votre localisation.",
        "pill_emergencies": "Urgences",
        "pill_doctors": "Médecins",
        "pill_labs": "Laboratoires",
        "pill_bmi": "Calcul IMC",
        "pill_firstaid": "Premiers Secours",
        "filter_specialty_all": "Toutes les spécialités",
        "distance_away": "à",
        "btn_directions": "Itinéraire",
        "btn_call": "Appeler",
        "profile_login_title": "Bienvenue",
        "profile_login_desc": "Connectez-vous à SYDALIATI pour gérer vos adresses et favoris.",
        "profile_tab_phone": "Téléphone",
        "profile_tab_email": "Email",
        "input_phone_placeholder": "Numéro de téléphone",
        "input_email_placeholder": "Votre adresse email",
        "input_password_placeholder": "Mot de passe",
        "btn_continue": "Continuer",
        "btn_sign_in": "Se connecter",
        "btn_google_signin": "Continuer avec Google",
        "settings_language": "Langue (Language)",
        "badge_open": "Ouverte",
        "bmi_title": "Calculateur d'IMC",
        "bmi_desc": "Vérifiez votre Indice de Masse Corporelle",
        "bmi_weight": "Poids (kg)",
        "bmi_height": "Taille (cm)",
        "btn_calculate": "Calculer",
        "firstaid_title": "Premiers Secours",
        "firstaid_desc": "Gestes qui sauvent"
    },
    "darija": {
        "subtitle_local_services": "Khidmat Oujda",
        "tab_pharmacies": "Sydaliyat",
        "tab_tools": "Mosa3ada",
        "tab_profile": "Profil dyali",
        "tools_directory_title": "R9am Tiba",
        "tools_directory_desc": "Twasel m3a urgences, tba w labo f Oujda bzerba.",
        "btn_find_pharmacy": "9eleb 3la a9rab pharmacie",
        "btn_finding": "Kan9elbo...",
        "error_list_loading": "Listat pharmacies mazal katcharga wla fiha mochkil. 3awd actualiser.",
        "errorLine_geolocation": "Navigateur dyalk makay supportich l-localisation.",
        "error_location_denied": "3afak 3ti l'autorisation dyal localisation bach nl9aw pharmacies 9rab lik.",
        "error_location_general": "M9dernach n3erfo blastek.",
        "pill_emergencies": "Urgences",
        "pill_doctors": "Tba",
        "pill_labs": "Labo",
        "pill_bmi": "Mizan dial Jism",
        "pill_firstaid": "Is3afat Awalya",
        "filter_specialty_all": "Gua3 tba",
        "distance_away": "b3ida b",
        "btn_directions": "Sair Liha",
        "btn_call": "Tassel",
        "profile_login_title": "Merhba Bik",
        "profile_login_desc": "Dkhel l SYDALIATI bach tsauvi l'adresse w l-favoris dyalak.",
        "profile_tab_phone": "Tili",
        "profile_tab_email": "Email",
        "input_phone_placeholder": "Nymra d Tili",
        "input_email_placeholder": "Email dyalak",
        "input_password_placeholder": "Mot de passe",
        "btn_continue": "Zid",
        "btn_sign_in": "Dkhel",
        "btn_google_signin": "Dkhel b Google",
        "settings_language": "Logha (Language)",
        "badge_open": "Mehloula",
        "bmi_title": "Hseb l'IMC",
        "bmi_desc": "Chouf l'Mizan dial Jismk",
        "bmi_weight": "Lwazn (kg)",
        "bmi_height": "Toul (cm)",
        "btn_calculate": "Hseb",
        "firstaid_title": "Is3afat Awalya",
        "firstaid_desc": "7arakat kat3te9 rou7"
    }
};

let currentLang = 'fr'; // default

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Check if input element with placeholder
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', translations[lang][key]);
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Re-render dynamic elements that depend on translations (like tool pills, filters)
    updateDynamicTranslations();
}

function t(key) {
    return translations[currentLang][key] || key;
}

function updateDynamicTranslations() {
    // Manually push standard translations to hardcoded text points where data-attributes aren't active yet
    const btnLocateSpan = document.querySelector('#locate-btn span');
    if (btnLocateSpan && !document.getElementById('locate-btn').classList.contains('loading')) {
        btnLocateSpan.textContent = t('btn_find_pharmacy');
    }
    
    // Ensure all status badges update
    document.querySelectorAll('.status-badge').forEach(badge => {
        badge.textContent = t('badge_open');
    });

    // Update Distance text in cards
    document.querySelectorAll('.distance-value').forEach(el => {
        const distNum = el.textContent.split(' ')[0]; // Very hacky matching, but sufficient for purely static presentation
        if (el.textContent.includes('km')) {
            el.textContent = `${distNum} km ${currentLang === 'darija' ? '' : 'away'}`;
        }
    });
}
