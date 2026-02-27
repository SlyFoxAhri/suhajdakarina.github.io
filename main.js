/* ============================================================
   SUHAJDA KARINA — PORTFOLIO
   main.js
   Sections:
     1. Project Data (EN + HU)
     2. Language Switcher
     3. Modal Logic
     4. Burger Menu
   ============================================================ */


/* ─────────────────────────────────────────────────────────────
   1. PROJECT DATA
   Each project has an `en` and `hu` block.
   Add your video path to the `video` field when ready.
───────────────────────────────────────────────────────────── */
const projects = [
    {
        video: "videos/grpc_vid.mp4", 
        thumbnail: "",
        en: {
            title: "gRPC Service",
            overview: "A secure backend service built around gRPC, enabling efficient, communication between microservices with a WPF minimalist frontend.",
            highlights: [
                "Auto-generated client/server stubs via protobuf",
                "Hashed + salted storing of user credentials",
                "Token based authentication",
                "TLS encryption",
                "Parameterised SQL",
                "Input validation",
                "Messsage size limiting"
            ],
            techStack: ["C#", "gRPC", "Protocol Buffers", "Docker", "REST"]
        },
        hu: {
            title: "gRPC Szolgáltatás",
            overview: "Biztonságos backend szolgáltatás gRPC alapon, amely hatékony kommunikációt tesz lehetővé mikroszolgáltatások között,  WPF minimalista frontend-el.",
            highlights: [
                "Auto-generált cliens/szerver stub-ok protobuf segítségével",
                "Hashed-elt + sózott tárolása a felhasználó adatoknak",
                "Token alapú hitelesítés",
                "TLS titkosítás",
                "Paraméterezett SQL",
                "Adat validáció",
                "Üzenet méret limitálás"
            ],
            techStack: ["C#", "gRPC", "Protocol Buffers", "Docker", "REST"],
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri" }]
    },
    {
        video: "",
        en: {
            title: "Retro Console",
            overview: "A retro-futuristic command console web application with a terminal aesthetic — green-on-black, CRT scanlines, and a custom command parser.",
            highlights: [
                "Custom command interpreter",
                "Animated CRT scanline & glow effects",
                "Keyboard-driven UX",
                "Extensible command plugin system"
            ],
            techStack: ["HTML", "CSS", "JavaScript", "Python"]
        },
        hu: {
            title: "Retró Konzol",
            overview: "Retro-futurisztikus parancssoros webalkalmazás terminál esztétikával — zöld-fekete, CRT scanline effektek és egyéni parancsértelmező.",
            highlights: [
                "Egyéni parancsértelmező",
                "Animált CRT scanline és fényhatások",
                "Billentyűzettel vezérelt UX",
                "Bővíthető parancsbővítmény rendszer"
            ],
            techStack: ["HTML", "CSS", "JavaScript", "Python"]
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri" }]

    },
    {
        video: "",
        en: {
            title: "This Portfolio",
            overview: "A clean, responsive personal portfolio site designed and built from scratch to showcase projects and skills.",
            highlights: [
                "Fully responsive layout",
                "Interactive project modal system",
                "Smooth animations and transitions",
                "Accessible markup and keyboard navigation"
            ],
            techStack: ["HTML", "CSS", "JavaScript"]
        },
        hu: {
            title: "Ez a Portfólió",
            overview: "Letisztult, reszponzív személyes portfólió weboldal, amelyet nulláról terveztem és építettem a projektek és készségek bemutatására.",
            highlights: [
                "Teljesen reszponzív elrendezés",
                "Interaktív projekt modal rendszer",
                "Sima animációk és átmenetek",
                "Akadálymentes kód és billentyűzetes navigáció"
            ],
            techStack: ["HTML", "CSS", "JavaScript"]
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri" }]
    }
];


/* ─────────────────────────────────────────────────────────────
   2. LANGUAGE SWITCHER
   - Reads data-en / data-hu attributes on every translatable element
   - Re-populates open modal if one is active
   - Saves preference to localStorage
───────────────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('lang') || 'en';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Translate every element that has data-en and data-hu
    document.querySelectorAll('[data-en][data-hu]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Update active state on lang buttons
    document.querySelectorAll('#lang-selector .hybrid-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // If a modal is open, re-render it in the new language
    const openCard = document.querySelector('.project-card[data-project].modal-open');
    if (openCard) {
        renderModal(+openCard.dataset.project);
    }
}

// Wire up lang buttons
document.querySelectorAll('#lang-selector .hybrid-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

// Apply saved language on load
applyLanguage(currentLang);


/* ─────────────────────────────────────────────────────────────
   3. MODAL LOGIC
───────────────────────────────────────────────────────────── */
const modal            = document.getElementById('projectModal');
const modalClose       = document.getElementById('modalClose');
const backdrop         = modal.querySelector('.project-modal-backdrop');
const modalVideo       = document.getElementById('modalVideo');
const modalVideoSrc    = document.getElementById('modalVideoSrc');
const videoPlaceholder = document.getElementById('videoPlaceholder');

/**
 * Renders modal content for the given project index in the current language.
 * @param {number} index
 */
function renderModal(index) {
    const p    = projects[index];
    const data = p[currentLang];

    document.getElementById('modalTitle').textContent   = data.title;
    document.getElementById('modalOverview').textContent = data.overview;

    document.getElementById('modalTechStack').innerHTML =
        data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

    document.getElementById('modalHighlights').innerHTML =
        data.highlights.map(h => `<li>${h}</li>`).join('');

    document.getElementById('modalLinks').innerHTML =
        p.links.map(l =>
            `<a href="${l.url}" target="_blank" class="modal-link-btn"><span>${l.label}</span></a>`
        ).join('');
}

/**
 * Opens the modal for the given project index.
 * @param {number} index
 */
function openProject(index) {
    renderModal(index);

    // Track which card is open so language switch can re-render
    document.querySelectorAll('.project-card').forEach(c => c.classList.remove('modal-open'));
    document.querySelector(`.project-card[data-project="${index}"]`).classList.add('modal-open');

    if (projects[index].video) {
        modalVideoSrc.src = projects[index].video;
        modalVideo.load();
        modalVideo.play();
        modalVideo.style.display       = 'block';
        videoPlaceholder.style.display = 'none';
    } else {
        modalVideo.style.display       = 'none';
        videoPlaceholder.style.display = 'flex';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the modal and resets video.
 */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideoSrc.src = '';
    document.querySelectorAll('.project-card').forEach(c => c.classList.remove('modal-open'));
}

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProject(+card.dataset.project));
});

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ─────────────────────────────────────────────────────────────
   4. BURGER MENU (mobile)
───────────────────────────────────────────────────────────── */
const burger      = document.getElementById('burger');
const contactList = document.querySelector('.contacts_list');

burger.addEventListener('click', () => {
    contactList.classList.toggle('open');
});

contactList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => contactList.classList.remove('open'));
});
