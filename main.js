//PROJECT DATA
const projects = [
    {
        video: "videos/faces.mp4", 
        thumbnail: "",
        en: {
            title: "Kitty tamagotchi",
            overview: "Virtual pet cat with 2 minigames and real time needs that require day-to-day care. If you neglect it, it will start to meow until their needs are met, just like a real cat!",
            highlights: [
                "Dynamic state mchine",
                "Interactive minigames",
                "Non-blocking logic",
                "Cute"

            ],
            techStack: ["C++", "8x8 LED Matrix", "Elegoo UNO R3", "Microcontroller"]
        },
        hu: {
            title: "Cica tamagotchi",
            overview: "Virtuális cica 2 minijátékal és valós idejű szükségletekkel amik nap mint map figyelemre szorulank. Ha elhanyagolod akkor elkezd nyávogni amig nem foglalkozol vele, pont mint egy igazi macska!",
            highlights: [
                "Dinamikus állapotgép",
                "Interaktív minijátékok",
                "Nem blokkoló logika",
                "Aranyos"
            ],
            techStack: ["C++", "8x8 LED Mátrix", "Elegoo UNO R3", "Mikrokontroller"]
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri/kitty_tamagochi" }]
    },
    {
        video: "",
        thumbnail: "pictures/Screenshot_20260610_184916.png",
        en: {
            title: "REST API backend",
            overview: "A backend service for a simple social media app that lets users create, update, delete and trade their original characters, with user roles and database management",
            highlights: [
                "Structured file system",
                "Hashed + salted storing of user credentials",
                "Token based authentication",
                "Database isolation and atomicity",
                "File up and download"
            ],
            techStack: ["JavaScript", "SQLite", "Node.js", "NPM", "Express"]
        },
        hu: {
            title: "REST API backend",
            overview: "Egy szimpla közösségi média backend ami lehetővé teszi hogy a felhasználók készíthesenek és elcseréljék egymásal a létrehozott egyedi karaktereiket, felhasználói szerepek és adtbáziskezeléssel",
            highlights: [
                "Struktúrált fájlrendszer",
                "Hashed-elt + sózott tárolása a felhasználó adatoknak",
                "Token alapú hitelesítés",
                "Fájlok fel- és letöltése"
            ],
            techStack: ["JavaScript", "SQLite", "Node.js", "NPM", "Express"]
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri/OC_trader" }]
    },
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
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri/GrpcService_final" }]
    },
    {
        video: "videos/mold.mp4", 
        thumbnail: "",
        en: {
            title: "Slime mold(Physarum) simulation",
            overview: "Interactive simulation of behaviour of physarium and it's transport networks, based on an algorithm used to optimise solutions for graph problems.",
            highlights: [
                "Agent based simulation",
                "Trail deposition, diffusion, and evaporation",
                "Real time controls",
                "Configurable behaviour",
                "Grid based enviroment",
                "Cross platform build system"
            ],
            techStack: ["C++", "Raylib", "Cmake"]
        },
        hu: {
            title: "Nyálkagomba(Physarum) szimuláció",
            overview: "A nyálkagomba viselkedésének és terjedési hálózatainak interaktív szimulációja, a gráfproblémák megoldásának optimalizálására használt algoritmus alapján.",
            highlights: [
                "Ágensalapú szimuláció",
                "Nyomvonalak lerakása, diffúziója és párolgása",
                "Valós idejű vezérlés",
                "Konfigurálható viselkedés",
                "Rácsalapú környezet",
                "Platformfüggetlen buildrendszer"
            ],
            techStack: ["C++", "C", "Raylib", "Cmake"],
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri/SlimeMold" }]
    },
    {
        video: "videos/loading.mp4", 
        thumbnail: "",
        en: {
            title: "Gzip decompressor written from scratch",
            overview: "A gzip decompressor written from scratch without relying on an external library.",
            highlights: [
                "Parses gzip headers and validates structure",
                "Decodes DEFLATE blocks",
                "Implements Huffamn decoding",
                "Reconstructs data using LZ77 algorithm",
                "Handles compressed binary data at byte and bit level",
            ],
            techStack: ["C", "Huffman coding", "LZ77", "gzip"]
        },
        hu: {
            title: "Gzip kicsomagoló",
            overview: "Egy teljesen saját fejlesztésű gzip-kicsomagoló, külső könyvtárak használata nélkül.",
            highlights: [
                "Parsolja a gzip-fejléceket és validálja a szerkezetét",
                "Dekódolja a DEFLATE-blokkokat",
                "Implementálja a Huffman-dekódolást",
                "Rekonstruálja az adatokat LZ77 algoritmus segítségével",
                "Bájt- és bit-szinten kezeli a tömörített bináris adatokat",
            ],
            techStack: ["C", "Huffman-kódolás", "LZ77", "gzip"],
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri/zipper" }]
    }
    /*
    {
        video: "",
        en: {
            title: "Personal website",
            overview: "A clean, responsive personal website built to showcase my projects and skills.",
            highlights: [
                "Responsive layout",
                "Interactive project modal system",
                "Smooth animations and transitions",
                "Accessible markup and keyboard navigation"
            ],
            techStack: ["HTML", "CSS", "JavaScript, Github, Cloudflare"]
        },
        hu: {
            title: "Személyes weboldal",
            overview: "Letisztult, reszponzív személyes weboldal, amit a projektjeim és készségeim bemutatására készítettem.",
            highlights: [
                "Reszponzív elrendezés",
                "Interaktív projekt modal rendszer",
                "Letisztult animációk és átmenetek",
                "Akadálymentes kód és billentyűzetes navigáció"
            ],
            techStack: ["HTML", "CSS", "JavaScript, Github, Cloudflare"]
        },
        links: [{ label: "GitHub", url: "https://github.com/SlyFoxAhri/suhajdakarina.github.io" }]
    }*/
];


//LANGUAGE SWITCHER
let currentLang = localStorage.getItem('lang') || 'hu';

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


//MODAL LOGIC
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


//4. BURGER MENU (mobile)
const burger      = document.getElementById('burger');
const contactList = document.querySelector('.contacts_list');

burger.addEventListener('click', () => {
    contactList.classList.toggle('open');
});

contactList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => contactList.classList.remove('open'));
});
