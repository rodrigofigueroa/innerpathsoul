/* ═══════════════════════════════════════════════════════════
   INNER PATH — Shared site JavaScript
   Nav, i18n (EN/ES), scroll header, dynamic year
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     i18n — translations dictionary
     Brand names (Soul Channeling, Soul Mapping, etc.) are
     intentionally NOT translated — they are proper nouns.
     ────────────────────────────────────────────────────────── */
  var TRANSLATIONS = {


    /* ── A11Y / GLOBAL ── */
    'a11y.skip':      { en: 'Skip to content', es: 'Saltar al contenido' },
    'a11y.exploreMore': { en: 'Explore more', es: 'Explora más' },
    'therapist.roles':{ en: 'Soul Therapist · Body, Heart and Soul', es: 'Soul Therapist · Body, Heart and Soul' },

    /* ── RELATED CARD DESCRIPTIONS (shared across pages) ── */
    'card.tantra.desc':     { en: 'Vital energy awakens through breath and body — moving, opening, and finding its own path.',
                              es: 'La energía vital despierta a través de la respiración y el cuerpo — moviéndose, abriendo y encontrando su propio camino.' },
    'card.breathwork.desc': { en: 'Breath as a portal of transformation — circular breathing that opens access to expanded states.',
                              es: 'La respiración como portal de transformación — respiración circular que abre acceso a estados expandidos.' },
    'card.earth.desc':      { en: 'A deep session lying down on a mat, fully supported while breath releases what has been held.',
                              es: 'Una sesión profunda recostada sobre un tapete, completamente sostenida mientras la respiración libera lo contenido.' },
    'card.mirror.desc':     { en: 'Begins facing a mirror. Continues lying down, integrating what the mirror revealed.',
                              es: 'Comienza frente a un espejo. Continúa recostada, integrando lo que el espejo reveló.' },
    'card.water.desc':      { en: 'Floating inside a pool, held by the therapist while breath guides a profound release.',
                              es: 'Flotando dentro de una alberca, sostenida por la terapeuta mientras la respiración guía una liberación profunda.' },

    /* ── INDEX: bwc main + sub cards ── */
    'bwc.main.desc': { en: 'Breath as a deep portal of transformation. A practice based on circular breathing — continuous and conscious — that opens access to expanded states of perception, releasing what is held in the body and connecting with the intelligence of the soul.',
                       es: 'La respiración como portal profundo de transformación. Una práctica basada en la respiración circular — continua y consciente — que abre acceso a estados expandidos de percepción, liberando lo que el cuerpo retiene y conectando con la inteligencia del alma.' },
    'bwc.earth.kicker':  { en: '01 — Grounded breathwork',     es: '01 — Breathwork de arraigo' },
    'bwc.mirror.kicker': { en: '02 — Mirror-based activation', es: '02 — Activación frente al espejo' },
    'bwc.water.kicker':  { en: '03 — Floating immersion',      es: '03 — Inmersión flotante' },
    'bwc.earth.desc':  { en: 'Deep session lying down on a mat. The body is fully supported while breath releases what has been held.',
                         es: 'Sesión profunda recostada sobre un tapete. El cuerpo está completamente sostenido mientras la respiración libera lo contenido.' },
    'bwc.mirror.desc': { en: 'Begins facing a mirror, holding your own gaze. Continues lying down, integrating what was revealed.',
                         es: 'Comienza frente a un espejo, sosteniendo tu propia mirada. Continúa recostada, integrando lo revelado.' },
    'bwc.water.desc':  { en: 'Inside a pool, floating with an eye mask. The therapist holds you as breath guides a deep release.',
                         es: 'Dentro de una alberca, flotando con un antifaz. La terapeuta te sostiene mientras la respiración guía una liberación profunda.' },

    /* ── INDEX: sessions-menu compact cards ── */
    'sm.tantra.kicker':     { en: 'Energetic activation',     es: 'Activación energética' },
    'sm.guidance.kicker':   { en: 'Integration & clarity',    es: 'Integración y claridad' },
    'sm.oracle.kicker':     { en: 'Multidimensional reading', es: 'Lectura multidimensional' },
    'sm.channeling.desc': { en: 'Hands over the heart — a direct point of contact that sustains and opens the inner space.',
                            es: 'Manos sobre el corazón — un punto de contacto directo que sostiene y abre el espacio interior.' },
    'sm.mapping.desc':    { en: 'The word becomes a doorway — exploring the inner world through language and its hidden patterns.',
                            es: 'La palabra se vuelve una puerta — explorando el mundo interior a través del lenguaje y sus patrones ocultos.' },
    'sm.tantra.desc':     { en: 'Kundalini awakens through breath and body — energy moves, opens, and finds its own path.',
                            es: 'La kundalini despierta a través de la respiración y el cuerpo — la energía se mueve, abre y encuentra su camino.' },
    'sm.guidance.desc':   { en: 'Conscious dialogue that gives form to lived experience — organizing what has emerged into meaning.',
                            es: 'Diálogo consciente que da forma a la experiencia vivida — organizando lo que emergió en significado.' },
    'sm.oracle.desc':     { en: 'Oracle decks as a mirror — accessing emotional, energetic and soul realms with clarity.',
                            es: 'Barajas de oráculo como espejo — accediendo a los reinos emocional, energético y del alma con claridad.' },

    /* ── INDEX: full-screen breathwork block ── */
    'bwFull.intro':    { en: 'Breath as a deep portal of transformation. Soul Breathwork is a practice based on circular breathing, a continuous and conscious breathing that allows access to expanded states of perception.',
                         es: 'La respiración como portal profundo de transformación. Soul Breathwork es una práctica basada en la respiración circular, una respiración continua y consciente que permite acceder a estados expandidos de percepción.' },
    'bwFull.earth.desc':  { en: 'Grounded breathwork — a deep breathing session in a lying-down position.',
                            es: 'Breathwork de arraigo — una sesión de respiración profunda en posición recostada.' },
    'bwFull.mirror.desc': { en: 'Mirror-based activation — a direct encounter with yourself.',
                            es: 'Activación frente al espejo — un encuentro directo contigo misma.' },
    'bwFull.water.desc':  { en: 'Floating immersion — an experience of deep surrender inside the pool.',
                            es: 'Inmersión flotante — una experiencia de rendición profunda dentro de la alberca.' },

    /* ── INDEX: carousel slides ── */
    'car.channeling.sub': { en: 'A space of deep opening', es: 'Un espacio de apertura profunda' },
    'car.mapping.sub':    { en: 'A space where the word becomes a doorway', es: 'Un espacio donde la palabra se vuelve una puerta' },
    'car.tantra.sub':     { en: 'A space of energetic activation', es: 'Un espacio de activación energética' },
    'car.guidance.sub':   { en: 'A space of clarity and understanding', es: 'Un espacio de claridad y comprensión' },
    'car.oracle.sub':     { en: 'A space for guidance and deep inner connection', es: 'Un espacio de orientación y conexión interior profunda' },
    'car.channeling.body':{ en: "In this practice, the therapist places their hands over the patient's heart, generating a direct point of contact that sustains, contains, and opens the inner space.",
                            es: 'En esta práctica, la terapeuta coloca sus manos sobre el corazón del paciente, generando un punto de contacto directo que sostiene, contiene y abre el espacio interior.' },
    'car.mapping.body':   { en: 'Soul Mapping is a therapy that allows the inner world to be explored through language, revealing emotional, subconscious, and family patterns.',
                            es: 'Soul Mapping es una terapia que permite explorar el mundo interior a través del lenguaje, revelando patrones emocionales, subconscientes y familiares.' },
    'car.tantra.body':    { en: 'This work focuses on the vital energy of the body, known as kundalini — an energy that awakens and ascends naturally through breath, presence, and body awareness.',
                            es: 'Este trabajo se enfoca en la energía vital del cuerpo, conocida como kundalini — una energía que despierta y asciende naturalmente a través de la respiración, la presencia y la conciencia corporal.' },
    'car.guidance.body':  { en: 'Soul Guidance is an accompaniment where the lived experience begins to take form through words, allowing what has emerged to be organized, understood, and given meaning.',
                            es: 'Soul Guidance es un acompañamiento donde la experiencia vivida comienza a tomar forma a través de las palabras, permitiendo que lo emergido se organice, comprenda y adquiera significado.' },
    'car.oracle.body':    { en: 'Soul Oracle Reading is a multidimensional reading that uses different oracle decks as a tool to access the emotional, energetic, and soul realms.',
                            es: 'Soul Oracle Reading es una lectura multidimensional que utiliza diferentes barajas de oráculo como herramienta para acceder a los reinos emocional, energético y del alma.' },

    /* ── BULLET LISTS per page ── */
    'li.ch.1': { en: 'transcended souls', es: 'almas trascendidas' },
    'li.ch.2': { en: 'souls within a human experience', es: 'almas dentro de una experiencia humana' },
    'li.ch.3': { en: 'family constellation dynamics', es: 'dinámicas de constelación familiar' },
    'li.ch.4': { en: 'memories, past experiences, or past lives', es: 'memorias, experiencias pasadas o vidas pasadas' },

    'li.mp.1': { en: 'patterns are identified', es: 'se identifican patrones' },
    'li.mp.2': { en: 'blockages are revealed', es: 'se revelan bloqueos' },
    'li.mp.3': { en: 'emotional and family dynamics become visible', es: 'las dinámicas emocionales y familiares se hacen visibles' },

    'li.tn.1': { en: 'greater sensitivity in the body', es: 'mayor sensibilidad en el cuerpo' },
    'li.tn.2': { en: 'emotional opening', es: 'apertura emocional' },
    'li.tn.3': { en: 'release of blockages', es: 'liberación de bloqueos' },
    'li.tn.4': { en: 'expansion of consciousness', es: 'expansión de la conciencia' },
    'li.tn.5': { en: 'a deeper connection with yourself', es: 'una conexión más profunda contigo misma' },

    'li.bw.1': { en: 'vital energy is activated', es: 'la energía vital se activa' },
    'li.bw.2': { en: 'stored emotions are released', es: 'las emociones almacenadas se liberan' },
    'li.bw.3': { en: 'the body is unblocked', es: 'el cuerpo se desbloquea' },
    'li.bw.4': { en: 'deep memories are accessed', es: 'se accede a memorias profundas' },
    'li.bw.5': { en: 'the nervous system enters a process of reorganization', es: 'el sistema nervioso entra en un proceso de reorganización' },
    'bw.modalities': { en: 'Three breathwork modalities:', es: 'Tres modalidades de breathwork:' },

    'li.ea.1': { en: 'releasing control of the body', es: 'soltar el control del cuerpo' },
    'li.ea.2': { en: 'entering a deeper state of inner connection', es: 'entrar en un estado más profundo de conexión interior' },
    'li.ea.3': { en: 'facilitating emotional release', es: 'facilitar la liberación emocional' },
    'li.ea.4': { en: 'allowing the experience to unfold with greater openness', es: 'permitir que la experiencia se despliegue con mayor apertura' },

    'li.mi.1': { en: 'the emotional experience intensifies', es: 'la experiencia emocional se intensifica' },
    'li.mi.2': { en: 'deeper layers are released', es: 'se liberan capas más profundas' },
    'li.mi.3': { en: 'integration happens from a more internal place', es: 'la integración ocurre desde un lugar más interno' },

    'li.wa.1': { en: 'entering very deep states of introspection', es: 'entrar en estados muy profundos de introspección' },
    'li.wa.2': { en: 'releasing control more completely', es: 'soltar el control de forma más completa' },
    'li.wa.3': { en: 'accessing more subtle levels of the experience', es: 'acceder a niveles más sutiles de la experiencia' },
    'li.wa.4': { en: 'releasing emotions fluidly', es: 'liberar emociones fluidamente' },

    'li.gu.1': { en: 'cognitive-behavioral', es: 'cognitivo-conductual' },
    'li.gu.2': { en: 'rational-emotive', es: 'racional-emotivo' },
    'li.gu.3': { en: 'semiological', es: 'semiológico' },
    'li.gu.4': { en: 'family constellations', es: 'constelaciones familiares' },
    'li.gu.5': { en: 'and other therapeutic practices', es: 'y otras prácticas terapéuticas' },

    /* ── NAV ── */
    'nav.therapies':   { en: 'Therapies',   es: 'Terapias' },
    'nav.breathwork':  { en: 'Breathwork',   es: 'Breathwork' },
    'nav.retreat':     { en: 'Retreat',      es: 'Retiro' },
    'nav.about':       { en: 'About',        es: 'Acerca de' },

    /* ── SHARED CTAs ── */
    'cta.readmore':    { en: 'Read more',    es: 'Leer más' },
    'cta.book':        { en: 'Book a session', es: 'Reservar sesión' },
    'cta.back':        { en: 'Back',         es: 'Regresar' },
    'cta.discover':    { en: 'Discover',     es: 'Descubrir' },
    'cta.backHome':    { en: 'Back to Inner Path', es: 'Regresar a Inner Path' },

    /* ── PAGE: INDEX ── */
    'index.subtitle':      { en: 'A space of return', es: 'Un espacio de regreso' },
    'index.intro':         { en: 'A path that invites you to come back to yourself, to your body, to your feeling, and to your deepest truth. Here you do not come to become someone else, but to remember who you are.',
                             es: 'Un camino que te invita a regresar a ti misma, a tu cuerpo, a tu sentir y a tu verdad más profunda. Aquí no se viene a convertirse en alguien más, sino a recordar quién eres.' },
    'index.soultag':       { en: 'Deep inner intelligence', es: 'Inteligencia interior profunda' },
    'index.soulbody':      { en: 'The most profound and beautiful spiritual intelligence living within every human being. In this work, Soul is understood as the deepest essence of who we are — the part that feels, remembers, guides, and silently knows the way home.',
                             es: 'La inteligencia espiritual más profunda y hermosa que vive dentro de cada ser humano. En este trabajo, el Alma es entendida como la esencia más profunda de quienes somos — la parte que siente, recuerda, guía y silenciosamente conoce el camino a casa.' },
    'index.therapytag':    { en: 'Integrated emotional & soul work', es: 'Trabajo emocional y del alma integrado' },
    'index.therapybody':   { en: 'Soul Therapy is the heart of this work. It is a form of accompaniment that integrates different tools to access each person\'s deep information — emotional, energetic, and soul-based.',
                             es: 'Soul Therapy es el corazón de este trabajo. Es una forma de acompañamiento que integra diferentes herramientas para acceder a la información profunda de cada persona — emocional, energética y del alma.' },
    'index.sessionsMenu':  { en: 'Sessions menu',   es: 'Menú de sesiones' },
    'index.ourTherapies':  { en: 'Our therapies',   es: 'Nuestras terapias' },
    'index.retreatEyebrow':{ en: 'Private immersive experience', es: 'Experiencia privada inmersiva' },
    'index.retreatIntro':  { en: 'An immersive private experience designed to support deep emotional, energetic, and inner transformation through the different Soul Therapy modalities. The retreat unfolds at your own rhythm — whether through consecutive immersion, weekly sessions, or an intensive weekend.',
                             es: 'Una experiencia privada inmersiva diseñada para apoyar una transformación emocional, energética e interior profunda a través de las diferentes modalidades de Soul Therapy. El retiro se despliega a tu propio ritmo — ya sea a través de inmersión consecutiva, sesiones semanales o un fin de semana intensivo.' },
    'index.philosophy':    { en: 'Philosophy',      es: 'Filosofía' },
    'index.theMethod':     { en: 'The method',      es: 'El método' },
    'index.yourTherapist': { en: 'Your therapist',  es: 'Tu terapeuta' },
    'index.therapistTitle':{ en: 'The soul does not need to be fixed. It needs to be heard.',
                             es: 'El alma no necesita ser arreglada. Necesita ser escuchada.' },
    'index.therapistLede': { en: 'I spent years looking for answers outside: in books, techniques, people who promised the path. Life led me inward. And it was there I found what had always been waiting.',
                             es: 'Pasé años buscando respuestas afuera: en libros, en técnicas, en personas que prometían el camino. La vida me fue llevando adentro. Y fue ahí donde encontré lo que siempre había estado esperando.' },
    'index.therapistBody': { en: 'It was not one single moment. It was a long, honest, and sometimes uncomfortable process — of looking at what I avoided, feeling what I suppressed, and releasing what no longer belonged to me. That is what transformed me. And that is what I accompany in every session.',
                             es: 'No fue un solo momento. Fue un proceso largo, honesto y a veces incómodo — de mirar lo que evitaba, sentir lo que reprimía y soltar lo que ya no me pertenecía. Eso fue lo que me transformó. Y eso es lo que acompaño ahora en cada sesión.' },
    'index.therapistClose':{ en: 'I created Inner Path so you do not have to walk that path alone. The session begins when you decide yes.',
                             es: 'Creé Inner Path para que no tengas que recorrer ese camino sola. La sesión comienza cuando tú decides que sí.' },

    /* ── PAGE: SOUL IS ── */
    'soul-is.tagline':  { en: 'Deep inner intelligence', es: 'Inteligencia interior profunda' },
    'soul-is.p1':       { en: 'Soul Is… The most profound and beautiful spiritual intelligence living within every human being. In this work, Soul is understood as the deepest essence of who we are — the part that feels, remembers, guides, and silently knows the way home.',
                          es: 'Soul Is… La inteligencia espiritual más profunda y hermosa que vive dentro de cada ser humano. En este trabajo, el Alma es entendida como la esencia más profunda de quienes somos — la parte que siente, recuerda, guía y silenciosamente conoce el camino a casa.' },
    'soul-is.p2':       { en: 'It is not something to analyze or define, but something to listen to, reconnect with, and experience directly through the body, emotion, and inner awareness.',
                          es: 'No es algo que analizar o definir, sino algo que escuchar, con lo que reconectarse y experimentar directamente a través del cuerpo, la emoción y la conciencia interior.' },
    'soul-is.guides':   { en: 'guides without imposing', es: 'guía sin imponer' },
    'soul-is.shows':    { en: 'shows without forcing',   es: 'muestra sin forzar' },
    'soul-is.reveals':  { en: 'reveals what is ready to be seen', es: 'revela lo que está listo para verse' },
    'soul-is.closing':  { en: 'The soul speaks through intuition, emotion, sensation, and inner knowing. That is why the soul is not meant to be analyzed, but deeply listened to.',
                          es: 'El alma habla a través de la intuición, la emoción, la sensación y el saber interior. Por eso el alma no está hecha para ser analizada, sino profundamente escuchada.' },

    /* ── PAGE: SOUL THERAPY ── */
    'soul-therapy.tagline': { en: 'Integrated emotional & soul work', es: 'Trabajo emocional y del alma integrado' },
    'soul-therapy.p1':      { en: 'Soul Therapy is the heart of this work. It is a form of accompaniment that integrates different tools to access each person\'s deep information — emotional, energetic, and soul-based.',
                              es: 'Soul Therapy es el corazón de este trabajo. Es una forma de acompañamiento que integra diferentes herramientas para acceder a la información profunda de cada persona — emocional, energética y del alma.' },
    'soul-therapy.p2':      { en: 'It is not about analyzing or correcting, but about opening a space where what lives within you can express itself, reveal itself, and take its place. Each process is unique, respecting the rhythm, the history, and the truth of each person.',
                              es: 'No se trata de analizar ni de corregir, sino de abrir un espacio donde lo que vive dentro de ti pueda expresarse, revelarse y tomar su lugar. Cada proceso es único, respetando el ritmo, la historia y la verdad de cada persona.' },
    'soul-therapy.p3':      { en: 'Within Soul Therapy, the work unfolds through different therapies that allow the experience to be entered from different levels.',
                              es: 'Dentro de Soul Therapy, el trabajo se despliega a través de diferentes terapias que permiten acceder a la experiencia desde diferentes niveles.' },

    /* ── SHARED THERAPY PAGE LABELS ── */
    'therapy.minimum':  { en: 'minimum', es: 'mínimo' },
    'therapy.duration': { en: 'Duration', es: 'Duración' },
    'therapy.related':  { en: 'Other therapies', es: 'Otras terapias' },
    'therapy.cta.title':{ en: 'Ready to begin?', es: '¿Lista para comenzar?' },
    'therapy.cta.body': { en: 'Each session is held with presence, care, and deep respect for your process. Reach out to explore which therapy aligns with your experience.',
                          es: 'Cada sesión se sostiene con presencia, cuidado y profundo respeto por tu proceso. Escríbenos para explorar qué terapia se alinea con tu experiencia.' },
    'therapy.cta.wa':   { en: 'Contact on WhatsApp', es: 'Contactar por WhatsApp' },

    /* ── PAGE: SOUL CHANNELING ── */
    'channeling.tag':   { en: 'Opening through presence', es: 'Apertura a través de la presencia' },
    'channeling.dur':   { en: '2 hour minimum', es: '2 horas mínimo' },
    'channeling.p1':    { en: 'A space of deep opening guided by the therapist. In this practice, the therapist places their hands over the patient\'s heart, generating a direct point of contact that sustains, contains, and opens the inner space.',
                          es: 'Un espacio de apertura profunda guiado por la terapeuta. En esta práctica, la terapeuta coloca sus manos sobre el corazón del paciente, generando un punto de contacto directo que sostiene, contiene y abre el espacio interior.' },
    'channeling.p2':    { en: 'Through this contact, a deep connection is established that allows the patient to release external attention and enter a state of greater sensitivity and openness. The use of an eye mask accompanies this process, helping the experience become even more internal, more perceptive, and more connected.',
                          es: 'A través de este contacto, se establece una conexión profunda que permite al paciente soltar la atención externa y entrar en un estado de mayor sensibilidad y apertura. El uso de un antifaz acompaña este proceso, ayudando a que la experiencia se vuelva aún más interna, más perceptiva y más conectada.' },
    'channeling.p3':    { en: 'From this place, images, sensations, and messages begin to manifest, emerging from a deeper level of consciousness. Within this space, it is possible to invite and give presence to transcended souls, or souls still within a human experience — revealing bonds or dynamics that need to be seen.',
                          es: 'Desde este lugar, imágenes, sensaciones y mensajes comienzan a manifestarse, emergiendo desde un nivel más profundo de la conciencia. Dentro de este espacio, es posible invitar y dar presencia a almas trascendidas, o almas aún dentro de una experiencia humana — revelando vínculos o dinámicas que necesitan ser vistas.' },
    'channeling.p4':    { en: 'This process may take the form of a family constellation, where the system reveals itself clearly and what was hidden can come to light. The soul of the person may also open an inner journey, accessing memories, experiences, or past lives, showing what needs to be understood, integrated, or released.',
                          es: 'Este proceso puede tomar la forma de una constelación familiar, donde el sistema se revela con claridad y lo que estaba oculto puede salir a la luz. El alma de la persona también puede abrir un viaje interior, accediendo a memorias, experiencias o vidas pasadas, mostrando lo que necesita ser comprendido, integrado o liberado.' },
    'channeling.p5':    { en: 'The therapist guides and holds the space with presence and sensitivity, allowing the experience to unfold organically. It is a space where the invisible becomes visible, and where the soul finds a way to communicate.',
                          es: 'La terapeuta guía y sostiene el espacio con presencia y sensibilidad, permitiendo que la experiencia se despliegue orgánicamente. Es un espacio donde lo invisible se vuelve visible, y donde el alma encuentra una forma de comunicarse.' },

    /* ── PAGE: SOUL MAPPING ── */
    'mapping.tag':  { en: 'Language as a portal', es: 'El lenguaje como portal' },
    'mapping.dur':  { en: '3 hour minimum', es: '3 horas mínimo' },
    'mapping.p1':   { en: 'A space where the word becomes a doorway. Soul Mapping is a therapy that allows the inner world to be explored through language. The person arrives with a theme, a concern, or an emotion, and from there a guided process opens where each word begins to reveal information.',
                      es: 'Un espacio donde la palabra se convierte en una puerta. Soul Mapping es una terapia que permite explorar el mundo interior a través del lenguaje. La persona llega con un tema, una preocupación o una emoción, y desde allí se abre un proceso guiado donde cada palabra comienza a revelar información.' },
    'mapping.p2':   { en: 'A living map is created from what the person says, feels, and repeats — a fabric of language that shows how their inner experience is structured. Words are not random. They arise from different levels of consciousness, moving between the conscious, the subconscious, and the unconscious.',
                      es: 'Se crea un mapa vivo de lo que la persona dice, siente y repite — un tejido de lenguaje que muestra cómo está estructurada su experiencia interior. Las palabras no son aleatorias. Surgen desde diferentes niveles de conciencia, moviéndose entre el consciente, el subconsciente y el inconsciente.' },
    'mapping.p3':   { en: 'Through this mapping, patterns are identified, blockages are revealed, and emotional and family dynamics become visible. Processes related to the family system may also open, where language begins to reveal inherited bonds, loyalties, and structures.',
                      es: 'A través de este mapeo, se identifican patrones, se revelan bloqueos y se hacen visibles dinámicas emocionales y familiares. También pueden abrirse procesos relacionados con el sistema familiar, donde el lenguaje comienza a revelar vínculos, lealtades y estructuras heredadas.' },
    'mapping.p4':   { en: 'Here, interpretation does not come from the analytical mind, but from deep listening that allows what is behind the words to be seen. Little by little, what was confused begins to organize itself… and what was hidden begins to reveal itself.',
                      es: 'Aquí, la interpretación no viene desde la mente analítica, sino desde una escucha profunda que permite ver lo que hay detrás de las palabras. Poco a poco, lo que estaba confuso comienza a organizarse… y lo que estaba oculto comienza a revelarse.' },

    /* ── PAGE: SOUL TANTRA ── */
    'tantra.tag':  { en: 'Energetic activation & consciousness expansion', es: 'Activación energética y expansión de la conciencia' },
    'tantra.dur':  { en: '2 hour minimum', es: '2 horas mínimo' },
    'tantra.p1':   { en: 'A space of energetic activation and expansion of consciousness. This work focuses on the vital energy of the body, known as kundalini — an energy that lives at the base of the spine and, when activated, begins to rise naturally through the body, moving through the energetic centers — the chakras.',
                     es: 'Un espacio de activación energética y expansión de la conciencia. Este trabajo se enfoca en la energía vital del cuerpo, conocida como kundalini — una energía que vive en la base de la columna y, cuando se activa, comienza a ascender naturalmente por el cuerpo, moviéndose a través de los centros energéticos — los chakras.' },
    'tantra.p2':   { en: 'As this energy moves, it opens, unblocks, and activates these centers, allowing energy to flow with greater freedom. This process may generate greater sensitivity in the body, emotional opening, release of blockages, expansion of consciousness, and a deeper connection with yourself.',
                     es: 'A medida que esta energía se mueve, abre, desbloquea y activa estos centros, permitiendo que la energía fluya con mayor libertad. Este proceso puede generar mayor sensibilidad en el cuerpo, apertura emocional, liberación de bloqueos, expansión de la conciencia y una conexión más profunda contigo misma.' },
    'tantra.p3':   { en: 'It is not something that is forced, but something that is allowed. Through breath, presence, and body work, the energy begins to awaken and move organically, respecting each person\'s rhythm.',
                     es: 'No es algo que se fuerza, sino algo que se permite. A través de la respiración, la presencia y el trabajo corporal, la energía comienza a despertar y moverse orgánicamente, respetando el ritmo de cada persona.' },
    'tantra.p4':   { en: 'Soul Tantra Activation does not seek to provoke an intense experience for its own sake, but to create the space for energy to express itself, reorganize itself, and find its own path. It is a process of opening, sensitivity, and connection, where the body becomes the channel.',
                     es: 'Soul Tantra Activation no busca provocar una experiencia intensa por sí misma, sino crear el espacio para que la energía se exprese, se reorganice y encuentre su propio camino. Es un proceso de apertura, sensibilidad y conexión, donde el cuerpo se convierte en el canal.' },

    /* ── PAGE: SOUL BREATHWORK ── */
    'breathwork.tag':  { en: 'Circular breathwork system', es: 'Sistema de respiración circular' },
    'breathwork.dur':  { en: '2 hour minimum', es: '2 horas mínimo' },
    'breathwork.p1':   { en: 'Breath as a deep portal of transformation. Soul Breathwork is a practice based on circular breathing — a continuous and conscious breathing that allows access to expanded states of perception.',
                         es: 'La respiración como un portal profundo de transformación. Soul Breathwork es una práctica basada en la respiración circular — una respiración continua y consciente que permite acceder a estados expandidos de percepción.' },
    'breathwork.p2':   { en: 'Through this type of breathing, vital energy is activated, stored emotions are released, the body is unblocked, deep memories are accessed, and the nervous system enters a process of reorganization. Breath becomes a bridge between the body, emotion, and the unconscious.',
                         es: 'A través de este tipo de respiración, la energía vital se activa, las emociones almacenadas se liberan, el cuerpo se desbloquea, se accede a memorias profundas y el sistema nervioso entra en un proceso de reorganización. La respiración se convierte en un puente entre el cuerpo, la emoción y el inconsciente.' },
    'breathwork.p3':   { en: 'It is a safe process, accompanied at all times, where the therapist holds the space while the person enters their own inner experience. Within this system there are three different types of sessions, each with a particular way of accessing the process:',
                         es: 'Es un proceso seguro, acompañado en todo momento, donde la terapeuta sostiene el espacio mientras la persona entra en su propia experiencia interior. Dentro de este sistema hay tres tipos diferentes de sesiones, cada uno con una forma particular de acceder al proceso:' },
    'breathwork.modalitiesLabel': { en: 'Three breathwork modalities', es: 'Tres modalidades de breathwork' },

    /* ── PAGE: EARTH BREATHWORK ── */
    'earth.tag':  { en: 'Grounded breathwork', es: 'Breathwork de arraigo' },
    'earth.p1':   { en: 'A deep breathing session in a lying-down position. It takes place on a mat or mattress, allowing the body to be completely supported in a safe space.',
                    es: 'Una sesión de respiración profunda en posición recostada. Se realiza sobre un tapete o colchoneta, permitiendo que el cuerpo esté completamente sostenido en un espacio seguro.' },
    'earth.p2':   { en: 'Through circular breathing, the body begins to open and release what has been contained, while the therapist holds the space throughout the process. Being lying down allows releasing control of the body, entering a deeper state of inner connection, facilitating emotional release, and allowing the experience to unfold with greater openness.',
                    es: 'A través de la respiración circular, el cuerpo comienza a abrirse y liberar lo que ha sido contenido, mientras la terapeuta sostiene el espacio durante todo el proceso. Estar recostada permite soltar el control del cuerpo, entrar en un estado más profundo de conexión interior, facilitar la liberación emocional y permitir que la experiencia se despliegue con mayor apertura.' },
    'earth.p3':   { en: 'During the session, specific music is used to accompany the process, facilitating the depth of the experience and access to broader states of perception.',
                    es: 'Durante la sesión se utiliza música específica para acompañar el proceso, facilitando la profundidad de la experiencia y el acceso a estados más amplios de percepción.' },

    /* ── PAGE: MIRROR BREATHWORK ── */
    'mirror.tag': { en: 'Mirror-based activation', es: 'Activación frente al espejo' },
    'mirror.p1':  { en: 'A direct encounter with yourself. This practice begins in front of a mirror, where for a determined period of time you hold your own gaze. Through this conscious confrontation, emotions, judgments, patterns, and different layers of identity begin to emerge.',
                    es: 'Un encuentro directo contigo misma. Esta práctica comienza frente a un espejo, donde durante un período de tiempo determinado sostienes tu propia mirada. A través de esta confrontación consciente, comienzan a emerger emociones, juicios, patrones y diferentes capas de identidad.' },
    'mirror.p2':  { en: 'The mirror becomes a doorway to what we normally avoid seeing. After this process, the practice continues lying down, with an eye mask, entering circular breathing. Here, everything that opened in front of the mirror deepens in the body: the emotional experience intensifies, deeper layers are released, and integration happens from a more internal place.',
                    es: 'El espejo se convierte en una puerta hacia lo que normalmente evitamos ver. Después de este proceso, la práctica continúa recostada, con un antifaz, entrando en la respiración circular. Aquí, todo lo que se abrió frente al espejo se profundiza en el cuerpo: la experiencia emocional se intensifica, capas más profundas se liberan y la integración ocurre desde un lugar más interno.' },
    'mirror.p3':  { en: 'Throughout the entire session, music accompanies the process, sustaining the rhythm and depth of the experience.',
                    es: 'Durante toda la sesión, la música acompaña el proceso, sosteniendo el ritmo y la profundidad de la experiencia.' },

    /* ── PAGE: WATER BREATHWORK ── */
    'water.tag':  { en: 'Floating immersion', es: 'Inmersión flotante' },
    'water.p1':   { en: 'An experience of immersion and deep surrender. This practice takes place inside a pool, where the person, with an eye mask, is held at all times by the therapist.',
                    es: 'Una experiencia de inmersión y rendición profunda. Esta práctica se realiza dentro de una alberca, donde la persona, con un antifaz, es sostenida en todo momento por la terapeuta.' },
    'water.p2':   { en: 'The body floats while the therapist holds both the space and the person, generating a sensation of containment, safety, and surrender. Circular breathing guides the entire process, allowing the person to enter very deep states of introspection, release control more completely, access more subtle levels of the experience, and release emotions fluidly.',
                    es: 'El cuerpo flota mientras la terapeuta sostiene tanto el espacio como a la persona, generando una sensación de contención, seguridad y rendición. La respiración circular guía todo el proceso, permitiendo a la persona entrar en estados muy profundos de introspección, soltar el control de manera más completa, acceder a niveles más sutiles de la experiencia y liberar emociones fluidamente.' },
    'water.p3':   { en: 'Water amplifies the sensation of support and allows for a more enveloping experience, where the body can relax deeply while the breath opens the inner process.',
                    es: 'El agua amplifica la sensación de apoyo y permite una experiencia más envolvente, donde el cuerpo puede relajarse profundamente mientras la respiración abre el proceso interior.' },

    /* ── PAGE: SOUL GUIDANCE ── */
    'guidance.tag': { en: 'Integration & emotional clarity', es: 'Integración y claridad emocional' },
    'guidance.dur': { en: '1 hour minimum', es: '1 hora mínimo' },
    'guidance.p1':  { en: 'A space of clarity, understanding, and integration. Soul Guidance is an accompaniment where the lived experience begins to take form through words, allowing what has emerged during the process to be organized, understood, and given meaning.',
                      es: 'Un espacio de claridad, comprensión e integración. Soul Guidance es un acompañamiento donde la experiencia vivida comienza a tomar forma a través de las palabras, permitiendo que lo que emergió durante el proceso se organice, comprenda y adquiera significado.' },
    'guidance.p2':  { en: 'Here, a conscious dialogue opens between the therapist and the patient, integrating the emotional with mental clarity and facilitating a deeper understanding of the experience. This space offers a broader perception and clarity from different approaches: cognitive-behavioral, rational-emotive, semiological, family constellations, and other therapeutic practices.',
                      es: 'Aquí se abre un diálogo consciente entre la terapeuta y el paciente, integrando lo emocional con la claridad mental y facilitando una comprensión más profunda de la experiencia. Este espacio ofrece una percepción más amplia y claridad desde diferentes enfoques: cognitivo-conductual, racional-emotivo, semiológico, constelaciones familiares y otras prácticas terapéuticas.' },
    'guidance.p3':  { en: 'Through this accompaniment, what was lived can be recognized, named, and understood, allowing the experience not only to be felt, but also integrated. Soul Guidance is the bridge between the inner experience… and the consciousness that holds it.',
                      es: 'A través de este acompañamiento, lo que fue vivido puede ser reconocido, nombrado y comprendido, permitiendo que la experiencia no solo se sienta, sino que también se integre. Soul Guidance es el puente entre la experiencia interior… y la conciencia que la sostiene.' },

    /* ── PAGE: SOUL ORACLE READING ── */
    'oracle.tag':  { en: 'Multidimensional oracle reading', es: 'Lectura de oráculo multidimensional' },
    'oracle.p1':   { en: 'A space for guidance, clarity, and deep inner connection. Soul Oracle Reading is a multidimensional reading that uses different oracle decks as a tool to access the emotional, energetic, and soul realms.',
                     es: 'Un espacio de orientación, claridad y conexión interior profunda. Soul Oracle Reading es una lectura multidimensional que utiliza diferentes barajas de oráculo como herramienta para acceder a los reinos emocional, energético y del alma.' },
    'oracle.p2':   { en: 'During the session, multiple decks and symbolic systems are woven into a single reading, allowing different layers of information to reveal themselves simultaneously. Each message becomes a mirror between the conscious and subconscious mind, opening a deeper conversation between your energy, your past, your present, and the possibilities that are beginning to emerge.',
                     es: 'Durante la sesión, múltiples barajas y sistemas simbólicos se tejen en una sola lectura, permitiendo que diferentes capas de información se revelen simultáneamente. Cada mensaje se convierte en un espejo entre la mente consciente e inconsciente, abriendo una conversación más profunda entre tu energía, tu pasado, tu presente y las posibilidades que comienzan a emerger.' },
    'oracle.p3':   { en: 'Oracle Reading is not about predicting the future. It is a space where messages, symbols, images, and intuitive information come together to reveal what is ready to be seen, understood, or acknowledged within your process. Every message arrives exactly when your soul is ready to hear it.',
                     es: 'La Lectura de Oráculo no se trata de predecir el futuro. Es un espacio donde mensajes, símbolos, imágenes e información intuitiva se reúnen para revelar lo que está listo para ser visto, comprendido o reconocido dentro de tu proceso. Cada mensaje llega exactamente cuando tu alma está lista para escucharlo.' },

    /* ── PAGE: RETIRO ── */
    'retiro.eyebrow':  { en: 'Private immersive experience', es: 'Experiencia privada inmersiva' },
    'retiro.subtitle': { en: 'An immersive encounter with yourself', es: 'Un encuentro inmersivo contigo misma' },
    'retiro.howItUnfolds': { en: 'How it unfolds', es: 'Cómo se despliega' },
    'retiro.threeFormats': { en: 'Three formats', es: 'Tres formatos' },
    'retiro.investment':   { en: 'Investment', es: 'Inversión' },
    'retiro.packages':     { en: 'Packages', es: 'Paquetes' },
    'retiro.person':       { en: '1 Person', es: '1 Persona' },
    'retiro.couples':      { en: 'Couples', es: 'Parejas' },
    'retiro.hours':        { en: 'Hours', es: 'Horas' },
    'retiro.weekly':       { en: 'Weekly', es: 'Semanal' },
    'retiro.immersion':    { en: 'Immersion', es: 'Inmersión' },
    'retiro.weekend':      { en: 'Weekend', es: 'Fin de semana' },
    'retiro.p1': { en: 'The Soul Personal Retreat is an immersive private experience designed to support deep emotional, energetic, and inner transformation through the different Soul Therapy modalities.',
                   es: 'El Soul Personal Retreat es una experiencia privada inmersiva diseñada para apoyar una transformación emocional, energética e interior profunda a través de las diferentes modalidades de Soul Therapy.' },
    'retiro.p2': { en: 'The retreat can unfold as a consecutive immersion, weekly sessions over time, or an intensive weekend experience — adapting entirely to each person\'s rhythm and process.',
                   es: 'El retiro puede desplegarse como una inmersión consecutiva, sesiones semanales a lo largo del tiempo, o una experiencia intensiva de fin de semana — adaptándose completamente al ritmo y proceso de cada persona.' },
    'retiro.p3': { en: 'It is a space held in complete confidentiality and care, where the only intention is to create the conditions for something real to emerge.',
                   es: 'Es un espacio sostenido en completa confidencialidad y cuidado, donde la única intención es crear las condiciones para que algo real emerja.' },
    'retiro.fa': { en: 'One session per week, 4 to 5 hours each — a gradual deepening at your own pace over several weeks.',
                   es: 'Una sesión por semana, de 4 a 5 horas cada una — una profundización gradual a tu propio ritmo durante varias semanas.' },
    'retiro.fb': { en: '20 or 25 hours concentrated within one week — five continuous days of full immersion and transformation.',
                   es: '20 o 25 horas concentradas dentro de una semana — cinco días continuos de inmersión y transformación completa.' },
    'retiro.fc': { en: '20 or 25 hours from Friday to Sunday — an intensive weekend container for deep and focused inner work.',
                   es: '20 o 25 horas de viernes a domingo — un contenedor intensivo de fin de semana para un trabajo interior profundo y enfocado.' },
    'retiro.ready':  { en: 'Ready to begin?',  es: '¿Lista para comenzar?' },
    'retiro.ctabody':{ en: 'Each retreat is tailored personally. Reach out to explore which format aligns with your process.',
                       es: 'Cada retiro se diseña personalmente. Contáctanos para explorar qué formato se alinea con tu proceso.' },

    /* ── FOOTER ── */
    'footer.therapies':  { en: 'Soul Therapies',  es: 'Soul Therapies' },
    'footer.breathwork': { en: 'Soul Breathwork', es: 'Soul Breathwork' },
    'footer.contact':    { en: 'Contact',         es: 'Contacto' },
    'footer.rights':     { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    'footer.tagline':    { en: 'The Soul Knows The Way Home', es: 'El Alma Conoce el Camino a Casa' },
  };

  /* ──────────────────────────────────────────────────────────
     Apply language to all [data-i18n] elements
     ────────────────────────────────────────────────────────── */

  /* ──────────────────────────────────────────────────────────
     setLocalizedText — replaces the element's own text without
     destroying child elements (icons, <strong>, <mark>).
     ────────────────────────────────────────────────────────── */
  function setLocalizedText(el, str) {
    var nodes = el.childNodes;
    var replaced = false;
    var hasElementChild = false;

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 1) { hasElementChild = true; break; }
    }

    for (var j = 0; j < nodes.length; j++) {
      var n = nodes[j];
      if (n.nodeType !== 3) continue;           /* only text nodes */
      if (!n.nodeValue.trim()) continue;         /* skip whitespace */
      if (!replaced) {
        /* keep a trailing space when an icon follows the label */
        var next = n.nextSibling;
        n.nodeValue = (next && next.nodeType === 1) ? str + ' ' : str;
        replaced = true;
      } else {
        n.nodeValue = '';                        /* clear extra text nodes */
      }
    }

    if (!replaced) {
      /* element had no text of its own — insert it before any icon */
      el.insertBefore(document.createTextNode(hasElementChild ? str + ' ' : str), el.firstChild);
    }
  }

  var currentLang = localStorage.getItem('ip_lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('ip_lang', lang);

    /* Set html lang attribute */
    document.documentElement.setAttribute('lang', lang);

    /* Apply all translations.
       IMPORTANT: we replace ONLY text nodes so child elements
       (SVG icons, <strong>, <mark>) survive the language switch.
       Using textContent here would delete them. */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var entry = TRANSLATIONS[key];
      if (!entry || !entry[lang]) return;
      setLocalizedText(el, entry[lang]);
    });

    /* Sync all lang buttons across the page */
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    /* Update page title if data-i18n-title is present */
    var titleMeta = document.querySelector('[data-i18n-title]');
    if (titleMeta) {
      var titleKey = titleMeta.getAttribute('data-i18n-title');
      if (TRANSLATIONS[titleKey] && TRANSLATIONS[titleKey][lang]) {
        document.title = TRANSLATIONS[titleKey][lang] + ' — Inner Path';
      }
    }
  }

  /* ──────────────────────────────────────────────────────────
     Lang button click handler (works for any page)
     ────────────────────────────────────────────────────────── */
  function initLangSwitch() {
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
      });
    });
    /* Apply persisted language on load */
    applyLang(currentLang);
  }

  /* ──────────────────────────────────────────────────────────
     Nav: hamburger overlay, accordion submenus, desktop dropdown
     ────────────────────────────────────────────────────────── */
  function initNav() {
    var navBar    = document.getElementById('nav-bar');
    var hamburger = document.getElementById('nav-hamburger');
    var overlay   = document.getElementById('nav-overlay');
    if (!navBar || !hamburger || !overlay) return;

    /* Scroll state */
    window.addEventListener('scroll', function () {
      navBar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* Mobile overlay open/close */
    function openMenu() {
      overlay.classList.add('is-open');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', currentLang === 'es' ? 'Cerrar menú' : 'Close menu');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      overlay.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', currentLang === 'es' ? 'Abrir menú' : 'Open menu');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', function () {
      overlay.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* Mobile accordion submenus */
    overlay.querySelectorAll('.nav-primary__trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panelId = btn.getAttribute('aria-controls');
        var panel   = document.getElementById(panelId);
        var isOpen  = btn.getAttribute('aria-expanded') === 'true';
        overlay.querySelectorAll('.nav-primary__trigger[aria-expanded="true"]').forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var op = document.getElementById(other.getAttribute('aria-controls'));
            if (op) op.classList.remove('is-open');
          }
        });
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (panel) panel.classList.toggle('is-open', !isOpen);
      });
    });

    /* Desktop dropdown hover + 300ms grace period */
    var CLOSE_DELAY = 300;
    document.querySelectorAll('.nav-items__wrap').forEach(function (wrap) {
      var trigger = wrap.querySelector('.nav-items__trigger[aria-haspopup]');
      var timer;
      wrap.addEventListener('mouseenter', function () {
        clearTimeout(timer);
        wrap.classList.add('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      });
      wrap.addEventListener('mouseleave', function () {
        timer = setTimeout(function () {
          wrap.classList.remove('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }, CLOSE_DELAY);
      });
      if (trigger && trigger.tagName === 'BUTTON') {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          var open = wrap.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-items__wrap')) {
        document.querySelectorAll('.nav-items__wrap.is-open').forEach(function (w) {
          w.classList.remove('is-open');
          var t = w.querySelector('.nav-items__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     Dynamic year in footer
     ────────────────────────────────────────────────────────── */
  function initYear() {
    var el = document.getElementById('yr');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ──────────────────────────────────────────────────────────
     Init
     ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initLangSwitch();
    initYear();
  });

  /* Expose applyLang globally for inline use if needed */
  window.IP = { applyLang: applyLang, t: TRANSLATIONS };

})();
