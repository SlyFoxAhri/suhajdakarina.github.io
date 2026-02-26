/* ============================================================
   SUHAJDA KARINA — PORTFOLIO
   main.js
   Sections:
     1. Project Data
     2. Modal Logic
     3. Burger Menu
   ============================================================ */


/* ─────────────────────────────────────────────────────────────
   1. PROJECT DATA
   Add or edit projects here. Each object controls one card.
   Fields:
     title      — displayed in the modal header
     video      — path to an .mp4 file, e.g. "videos/grpc.mp4"
                  leave "" to show the placeholder instead
     overview   — short paragraph describing the project
     techStack  — array of technology names shown as tags
     highlights — array of bullet-point strings
     links      — array of { label, url } objects
───────────────────────────────────────────────────────────── */
const projects = [
    {
        title: "gRPC Service",
        video: "",   // e.g. "videos/grpc.mp4"
        overview: "A secure backend service built around gRPC, enabling efficient, communication between microservices with a WPF minimalist frontend.",
        techStack: ["C#", "gRPC", ".NET 10", "Protocol Buffers", "MySQL", "JWT Authentication", "TLS/HTTPS" ],
        highlights: [
            "Auto-generated client/server stubs via protobuf",
            "Hashed + salted storing of user credentials",
            "Token based authentication",
            "TLS encryption",
            "Parameterised SQL",
            "Input validation",
            "Messsage size limiting"
        ],
        links: [
            { label: "GitHub", url: "https://github.com/SlyFoxAhri" }
        ]
    },
    {
        title: "Retro Console",
        video: "",
        overview: "A retro-futuristic command console web application with a terminal aesthetic — green-on-black, CRT scanlines, and a custom command parser.",
        techStack: ["HTML", "CSS", "JavaScript", "Python"],
        highlights: [
            "Custom command interpreter",
            "Animated CRT scanline & glow effects",
            "Keyboard-driven UX",
            "Extensible command plugin system"
        ],
        links: [
            { label: "GitHub", url: "https://github.com/SlyFoxAhri" },
            { label: "Live Demo", url: "#" }
        ]
    },
    {
        title: "This Portfolio",
        video: "",
        overview: "A clean, responsive personal portfolio site designed and built from scratch to showcase projects and skills.",
        techStack: ["HTML", "CSS", "JavaScript"],
        highlights: [
            "Fully responsive layout",
            "Interactive project modal system",
            "Smooth animations and transitions",
            "Accessible markup and keyboard navigation"
        ],
        links: [
            { label: "GitHub", url: "https://github.com/SlyFoxAhri" }
        ]
    }
];


/* ─────────────────────────────────────────────────────────────
   2. MODAL LOGIC
───────────────────────────────────────────────────────────── */

// Element references
const modal            = document.getElementById('projectModal');
const modalClose       = document.getElementById('modalClose');
const backdrop         = modal.querySelector('.project-modal-backdrop');
const modalVideo       = document.getElementById('modalVideo');
const modalVideoSrc    = document.getElementById('modalVideoSrc');
const videoPlaceholder = document.getElementById('videoPlaceholder');

/**
 * Populates and opens the modal for the given project index.
 * @param {number} index - index into the projects array
 */
function openProject(index) {
    const p = projects[index];

    // Title
    document.getElementById('modalTitle').textContent = p.title;

    // Overview
    document.getElementById('modalOverview').textContent = p.overview;

    // Tech stack — render as individual tag spans
    document.getElementById('modalTechStack').innerHTML =
        p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

    // Highlights — render as list items
    document.getElementById('modalHighlights').innerHTML =
        p.highlights.map(h => `<li>${h}</li>`).join('');

    // Links — render as styled anchor buttons
    document.getElementById('modalLinks').innerHTML =
        p.links.map(l =>
            `<a href="${l.url}" target="_blank" class="modal-link-btn">
                <span>${l.label}</span>
             </a>`
        ).join('');

    // Video — show real video or fallback placeholder
    if (p.video) {
        modalVideoSrc.src = p.video;
        modalVideo.load();
        modalVideo.play();
        modalVideo.style.display  = 'block';
        videoPlaceholder.style.display = 'none';
    } else {
        modalVideo.style.display  = 'none';
        videoPlaceholder.style.display = 'flex';
    }

    // Open modal & lock body scroll
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the modal and resets the video.
 */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideoSrc.src = '';
}

// Attach click listener to every project card
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProject(+card.dataset.project));
});

// Close via button, backdrop click, or Escape key
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});


/* ─────────────────────────────────────────────────────────────
   3. BURGER MENU (mobile)
   Toggles the .open class on the nav list to show/hide links.
───────────────────────────────────────────────────────────── */
const burger      = document.getElementById('burger');
const contactList = document.querySelector('.contacts_list');

burger.addEventListener('click', () => {
    contactList.classList.toggle('open');
});

// Close mobile menu when any nav link is clicked
contactList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        contactList.classList.remove('open');
    });
});
