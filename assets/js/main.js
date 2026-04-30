/**
* Template Name: DevFolio - v4.10.0
* Template URL: https://bootstrapmade.com/devfolio-bootstrap-portfolio-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Intro type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: true
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})();

/**
 * Language Selector Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize language from localStorage
  const savedLang = localStorage.getItem('portfolioLang') || 'es';
  currentLang = savedLang;
  
  // Create language selector in header
  createLanguageSelector();
  
  // Apply initial translations
  applyTranslations();
});

function createLanguageSelector() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  // Check if selector already exists
  if (document.getElementById('lang-selector')) return;
  
  const selector = document.createElement('div');
  selector.id = 'lang-selector';
  selector.className = 'lang-selector';
  selector.innerHTML = `
    <button class="lang-btn ${currentLang === 'es' ? 'active' : ''}" data-lang="es" onclick="changeLanguage('es')">ES</button>
    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="changeLanguage('en')">EN</button>
  `;
  
  // Find the contact link and add selector before it
  const contactLink = navbar.querySelector('a[href="#contact"]');
  if (contactLink && contactLink.parentElement) {
    contactLink.parentElement.after(selector);
  } else {
    navbar.querySelector('ul').appendChild(selector);
  }
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portfolioLang', lang);
  
  // Update button states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  // Apply translations to page
  applyTranslations();
}

function applyTranslations() {
  // Complete translations dictionary
  const translations = {
    // Header Navigation
    'Home': { es: 'Inicio', en: 'Home' },
    'About': { es: 'Sobre mí', en: 'About' },
    'Skills': { es: 'Habilidades', en: 'Skills' },
    'Portfolio': { es: 'Portafolio', en: 'Portfolio' },
    'Contact': { es: 'Contacto', en: 'Contact' },
    
    // Hero Section
    'Juan Antonio Piña Ramos': { es: 'Juan Antonio Piña Ramos', en: 'Juan Antonio Piña Ramos' },
    'UX Researcher & Designer, UI Designer, Experience Designer, QA and Accessibility': { es: 'Investigador UX & Diseñador, UI Diseñador, Diseñador de Experiencias, QA y Accesibilidad', en: 'UX Researcher & Designer, UI Designer, Experience Designer, QA and Accessibility' },
    'Investigador UX & Diseñador, UI Diseñador, Diseñador de Experiencias, QA y Accesibilidad': { es: 'Investigador UX & Diseñador, UI Diseñador, Diseñador de Experiencias, QA y Accesibilidad', en: 'UX Researcher & Designer, UI Designer, Experience Designer, QA and Accessibility' },
    
    // About Section
    'About me': { es: 'Sobre mí', en: 'About me' },
    'Sobre mí': { es: 'Sobre mí', en: 'About me' },
    'Hi, I´m Juan Antonio!': { es: '¡Hola, soy Juan Antonio!', en: 'Hi, I´m Juan Antonio!' },
    '¡Hola, soy Juan Antonio!': { es: '¡Hola, soy Juan Antonio!', en: 'Hi, I´m Juan Antonio!' },
    'Name:': { es: 'Nombre:', en: 'Name:' },
    'Nombre:': { es: 'Nombre:', en: 'Name:' },
    'Bachelor´s Degree:': { es: 'Licenciatura:', en: 'Bachelor´s Degree:' },
    'Licenciatura:': { es: 'Licenciatura:', en: 'Bachelor´s Degree:' },
    'Videogames Design and Development at URJC university': { es: 'Diseño y Desarrollo de Videojuegos en la universidad URJC', en: 'Videogames Design and Development at URJC university' },
    'Diseño y Desarrollo de Videojuegos en la universidad URJC': { es: 'Diseño y Desarrollo de Videojuegos en la universidad URJC', en: 'Videogames Design and Development at URJC university' },
    'Profile:': { es: 'Perfil:', en: 'Profile:' },
    'Perfil:': { es: 'Perfil:', en: 'Profile:' },
    'Design & Art': { es: 'Diseño & Arte', en: 'Design & Art' },
    'Diseño & Arte': { es: 'Diseño & Arte', en: 'Design & Art' },
    'Email:': { es: 'Email:', en: 'Email:' },
    'Phone:': { es: 'Teléfono:', en: 'Phone:' },
    'Teléfono:': { es: 'Teléfono:', en: 'Phone:' },
    'Location:': { es: 'Ubicación:', en: 'Location:' },
    'Ubicación:': { es: 'Ubicación:', en: 'Location:' },
    'Madrid, Spain': { es: 'Madrid, España', en: 'Madrid, Spain' },
    'Madrid, España': { es: 'Madrid, España', en: 'Madrid, Spain' },
    'Very brief summary of my work personality': { es: 'Breve resumen de mi personalidad laboral', en: 'Very brief summary of my work personality' },
    'Breve resumen de mi personalidad laboral': { es: 'Breve resumen de mi personalidad laboral', en: 'Very brief summary of my work personality' },
    
    // Skills
    'User Centered Design': { es: 'Diseño Centrado en el Usuario', en: 'User Centered Design' },
    'Diseño Centrado en el Usuario': { es: 'Diseño Centrado en el Usuario', en: 'User Centered Design' },
    'Design Thinking': { es: 'Pensamiento de Diseño', en: 'Design Thinking' },
    'Pensamiento de Diseño': { es: 'Pensamiento de Diseño', en: 'Design Thinking' },
    'Accesibility': { es: 'Accesibilidad', en: 'Accesibility' },
    'Accesibilidad': { es: 'Accesibilidad', en: 'Accesibility' },
    'Accessibility': { es: 'Accesibilidad', en: 'Accessibility' },
    'Empathy': { es: 'Empatía', en: 'Empathy' },
    'Empatía': { es: 'Empatía', en: 'Empathy' },
    'Team Work and Communication': { es: 'Trabajo en Equipo y Comunicación', en: 'Team Work and Communication' },
    'Trabajo en Equipo y Comunicación': { es: 'Trabajo en Equipo y Comunicación', en: 'Team Work and Communication' },
    'Agile Methodologies': { es: 'Metodologías Ágiles', en: 'Agile Methodologies' },
    'Metodologías Ágiles': { es: 'Metodologías Ágiles', en: 'Agile Methodologies' },
    'Curiosity and Enthusiasm': { es: 'Curiosidad y Entusiasmo', en: 'Curiosity and Enthusiasm' },
    'Curiosidad y Entusiasmo': { es: 'Curiosidad y Entusiasmo', en: 'Curiosity and Enthusiasm' },
    
    // About Descriptions
    'A passionate designer who finds his happiness in transmitting emotions to people through the stimuli generated by his ideas captured on the screen.': { es: 'Un diseñador apasionado que encuentra su felicidad en transmitir emociones a las personas a través de los estímulos generados por sus ideas capturadas en la pantalla.', en: 'A passionate designer who finds his happiness in transmitting emotions to people through the stimuli generated by his ideas captured on the screen.' },
    'Un diseñador apasionado que encuentra su felicidad en transmitir emociones a las personas a través de los estímulos generados por sus ideas capturadas en la pantalla.': { es: 'Un diseñador apasionado que encuentra su felicidad en transmitir emociones a las personas a través de los estímulos generados por sus ideas capturadas en la pantalla.', en: 'A passionate designer who finds his happiness in transmitting emotions to people through the stimuli generated by his ideas captured on the screen.' },
    
    'I would like to specialize in the design of user interfaces and user experiences that are impactful and that convey the message and intentionality of the game.': { es: 'Me gustaría especializarme en el diseño de interfaces de usuario y experiencias de usuario que sean impactantes y que transmitan el mensaje e intencionalidad del juego.', en: 'I would like to specialize in the design of user interfaces and user experiences that are impactful and that convey the message and intentionality of the game.' },
    'Me gustaría especializarme en el diseño de interfaces de usuario y experiencias de usuario que sean impactantes y que transmitan el mensaje e intencionalidad del juego.': { es: 'Me gustaría especializarme en el diseño de interfaces de usuario y experiencias de usuario que sean impactantes y que transmitan el mensaje e intencionalidad del juego.', en: 'I would like to specialize in the design of user interfaces and user experiences that are impactful and that convey the message and intentionality of the game.' },
    
    'I try to develop diegetic designs as much as possible, after assessing whether they can be properly integrated into the specific context of the game.': { es: 'Intento desarrollar diseños diegéticos siempre que sea posible, después de evaluar si pueden integrarse adecuadamente en el contexto específico del juego.', en: 'I try to develop diegetic designs as much as possible, after assessing whether they can be properly integrated into the specific context of the game.' },
    'Intento desarrollar diseños diegéticos siempre que sea posible, después de evaluar si pueden integrarse adecuadamente en el contexto específico del juego.': { es: 'Intento desarrollar diseños diegéticos siempre que sea posible, después de evaluar si pueden integrarse adecuadamente en el contexto específico del juego.', en: 'I try to develop diegetic designs as much as possible, after assessing whether they can be properly integrated into the specific context of the game.' },
    
    'I am aware of digital accessibility standards. ': { es: 'Soy consciente de los estándares de accesibilidad digital. ', en: 'I am aware of digital accessibility standards. ' },
    'Soy consciente de los estándares de accesibilidad digital. ': { es: 'Soy consciente de los estándares de accesibilidad digital. ', en: 'I am aware of digital accessibility standards. ' },
    'Making software accessible should be an universal duty.': { es: 'Hacer el software accesible debería ser un deber universal.', en: 'Making software accessible should be an universal duty.' },
    'Hacer el software accesible debería ser un deber universal.': { es: 'Hacer el software accesible debería ser un deber universal.', en: 'Making software accessible should be an universal duty.' },
    
    'My goal is to connect video games with UI and to make the user experience satisfying in the best way possible with all my knowledge. I am excited and eager to join a dynamic and growing video game company where I can apply my skills and knowledge to contribute to the success of the team, as well as continue to develop personally and professionally.': { es: 'Mi objetivo es conectar los videojuegos con la UI y hacer que la experiencia del usuario sea satisfactoria de la mejor manera posible con todo mi conocimiento. Estoy emocionado y ansioso por unirme a una empresa de videojuegos dinámica y creciente donde pueda aplicar mis habilidades y conocimientos para contribuir al éxito del equipo, así como seguir desarrollándome personal y profesionalmente.', en: 'My goal is to connect video games with UI and to make the user experience satisfying in the best way possible with all my knowledge. I am excited and eager to join a dynamic and growing video game company where I can apply my skills and knowledge to contribute to the success of the team, as well as continue to develop personally and professionally.' },
    'Mi objetivo es conectar los videojuegos con la UI y hacer que la experiencia del usuario sea satisfactoria de la mejor manera posible con todo mi conocimiento. Estoy emocionado y ansioso por unirme a una empresa de videojuegos dinámica y creciente donde pueda aplicar mis habilidades y conocimientos para contribuir al éxito del equipo, así como seguir desarrollándome personal y profesionalmente.': { es: 'Mi objetivo es conectar los videojuegos con la UI y hacer que la experiencia del usuario sea satisfactoria de la mejor manera posible con todo mi conocimiento. Estoy emocionado y ansioso por unirme a una empresa de videojuegos dinámica y creciente donde pueda aplicar mis habilidades y conocimientos para contribuir al éxito del equipo, así como seguir desarrollándome personal y profesionalmente.', en: 'My goal is to connect video games with UI and to make the user experience satisfying in the best way possible with all my knowledge. I am excited and eager to join a dynamic and growing video game company where I can apply my skills and knowledge to contribute to the success of the team, as well as continue to develop personally and professionally.' },
    
    // Services
    'Services': { es: 'Servicios', en: 'Services' },
    'Servicios': { es: 'Servicios', en: 'Services' },
    'I can perform in various technical and artistic aspects, I have clear preferences but I am willing to learn or improve skills that I do not have so developed.': { es: 'Puedo desempeñarme en varios aspectos técnicos y artísticos, tengo preferencias claras pero estoy dispuesto a aprender o mejorar habilidades que no tengo tan desarrolladas.', en: 'I can perform in various technical and artistic aspects, I have clear preferences but I am willing to learn or improve skills that I do not have so developed.' },
    'Puedo desempeñarme en varios aspectos técnicos y artísticos, tengo preferencias claras pero estoy dispuesto a aprender o mejorar habilidades que no tengo tan desarrolladas.': { es: 'Puedo desempeñarme en varios aspectos técnicos y artísticos, tengo preferencias claras pero estoy dispuesto a aprender o mejorar habilidades que no tengo tan desarrolladas.', en: 'I can perform in various technical and artistic aspects, I have clear preferences but I am willing to learn or improve skills that I do not have so developed.' },
    'When it comes to my work, I am clear about my design guidelines.': { es: 'Cuando se trata de mi trabajo, tengo claras mis pautas de diseño.', en: 'When it comes to my work, I am clear about my design guidelines.' },
    'Cuando se trata de mi trabajo, tengo claras mis pautas de diseño.': { es: 'Cuando se trata de mi trabajo, tengo claras mis pautas de diseño.', en: 'When it comes to my work, I am clear about my design guidelines.' },
    
    // Service Titles
    'UX Research & Design': { es: 'Investigación UX y Diseño', en: 'UX Research & Design' },
    'Investigación UX y Diseño': { es: 'Investigación UX y Diseño', en: 'UX Research & Design' },
    'UI Design': { es: 'Diseño UI', en: 'UI Design' },
    'Diseño UI': { es: 'Diseño UI', en: 'UI Design' },
    '2D Art': { es: 'Arte 2D', en: '2D Art' },
    'Arte 2D': { es: 'Arte 2D', en: '2D Art' },
    'Experience Design': { es: 'Diseño de Experiencias', en: 'Experience Design' },
    'Diseño de Experiencias': { es: 'Diseño de Experiencias', en: 'Experience Design' },
    'QA': { es: 'QA', en: 'QA' },
    
    // Portfolio
    'Portfolio': { es: 'Portafolio', en: 'Portfolio' },
    'Portafolio': { es: 'Portafolio', en: 'Portfolio' },
    'An illustrated look at my personal and team works': { es: 'Una mirada ilustrada a mis trabajos personales y en equipo', en: 'An illustrated look at my personal and team works' },
    'Una mirada ilustrada a mis trabajos personales y en equipo': { es: 'Una mirada ilustrada a mis trabajos personales y en equipo', en: 'An illustrated look at my personal and team works' },
    'Click on the images or the ⊕ symbol to see more details.': { es: 'Haz clic en las imágenes o el símbolo ⊕ para ver más detalles.', en: 'Click on the images or the ⊕ symbol to see more details.' },
    'Haz clic en las imágenes o el símbolo ⊕ para ver más detalles.': { es: 'Haz clic en las imágenes o el símbolo ⊕ para ver más detalles.', en: 'Click on the images or the ⊕ symbol to see more details.' },
    
    // Teams
    'My Teams': { es: 'Mis Equipos', en: 'My Teams' },
    'Mis Equipos': { es: 'Mis Equipos', en: 'My Teams' },
    'Video game studios with which I have done some of the above work.': { es: 'Estudios de videojuegos con los que he realizado algunos de los trabajos anteriores.', en: 'Video game studios with which I have done some of the above work.' },
    'Estudios de videojuegos con los que he realizado algunos de los trabajos anteriores.': { es: 'Estudios de videojuegos con los que he realizado algunos de los trabajos anteriores.', en: 'Video game studios with which I have done some of the above work.' },
    
    // Team descriptions
    'Team Chubby Cat': { es: 'Team Chubby Cat', en: 'Team Chubby Cat' },
    'We are 5 developers and designers and during this last year we launched Chess: Holy War on Itch.io, CyberHell for Android and developed the Artifical Intelligence project Boo-Boo-School.': { es: 'Somos 5 desarrolladores y diseñadores y durante este último año lanzamos Chess: Holy War en Itch.io, CyberHell para Android y desarrollamos el proyecto de Inteligencia Artificial Boo-Boo-School.', en: 'We are 5 developers and designers and during this last year we launched Chess: Holy War on Itch.io, CyberHell for Android and developed the Artifical Intelligence project Boo-Boo-School.' },
    'Somos 5 desarrolladores y diseñadores y durante este último año lanzamos Chess: Holy War en Itch.io, CyberHell para Android y desarrollamos el proyecto de Inteligencia Artificial Boo-Boo-School.': { es: 'Somos 5 desarrolladores y diseñadores y durante este último año lanzamos Chess: Holy War en Itch.io, CyberHell para Android y desarrollamos el proyecto de Inteligencia Artificial Boo-Boo-School.', en: 'We are 5 developers and designers and during this last year we launched Chess: Holy War on Itch.io, CyberHell for Android and developed the Artifical Intelligence project Boo-Boo-School.' },
    
    'Mental Gaming': { es: 'Mental Gaming', en: 'Mental Gaming' },
    'During my internship in this company I participated in the still developing project Titan El Audaz, the educational video game for children with ASD.': { es: 'Durante mi internship en esta empresa participé en el proyecto en desarrollo Titan El Audaz, el videojuego educativo para niños con TEA.', en: 'During my internship in this company I participated in the still developing project Titan El Audaz, the educational video game for children with ASD.' },
    'Durante mi internship en esta empresa participé en el proyecto en desarrollo Titan El Audaz, el videojuego educativo para niños con TEA.': { es: 'Durante mi internship en esta empresa participé en el proyecto en desarrollo Titan El Audaz, el videojuegos educativo para niños con TEA.', en: 'During my internship in this company I participated in the still developing project Titan El Audaz, the educational video game for children with ASD.' },
    
    'Tizona Games': { es: 'Tizona Games', en: 'Tizona Games' },
    'Tizona Games is an independent development group formed by the union of 9 members passionate about the world of video games and their development.': { es: 'Tizona Games es un grupo de desarrollo independiente formado por la unión de 9 miembros apasionados por el mundo de los videojuegos y su desarrollo.', en: 'Tizona Games is an independent development group formed by the union of 9 members passionate about the world of video games and their development.' },
    'Tizona Games es un grupo de desarrollo independiente formado por la unión de 9 miembros apasionados por el mundo de los videojuegos y su desarrollo.': { es: 'Tizona Games es un grupo de desarrollo independiente formado por la unión de 9 miembros apasionados por el mundo de los videojuegos y su desarrollo.', en: 'Tizona Games is an independent development group formed by the union of 9 members passionate about the world of video games and their development.' },
    'Having participated in several HackJams, hosted by 42Madrid and Madrid in Game, we have some experience working together on small projects, and we want to take a step forward to settle in the scene.': { es: 'Habiendo participado en varios HackJams, organizados por 42Madrid y Madrid in Game, tenemos algo de experiencia trabajando juntos en proyectos pequeños, y queremos dar un paso adelante para establecernos en la escena.', en: 'Having participated in several HackJams, hosted by 42Madrid and Madrid in Game, we have some experience working together on small projects, and we want to take a step forward to settle in the scene.' },
    'Habiendo participado en varios HackJams, organizados por 42Madrid y Madrid in Game, tenemos algo de experiencia trabajando juntos en proyectos pequeños, y queremos dar un paso adelante para establecernos en la escena.': { es: 'Habiendo participado en varios HackJams, organizados por 42Madrid y Madrid in Game, tenemos algo de experiencia trabajando juntos en proyectos pequeños, y queremos dar un paso adelante para establecernos en la escena.', en: 'Having participated in several HackJams, hosted by 42Madrid and Madrid in Game, we have some experience working together on small projects, and we want to take a step forward to settle in the scene.' },
    
    // Contact
    'Mail me!': { es: '¡Escríbeme!', en: 'Mail me!' },
    '¡Escríbeme!': { es: '¡Escríbeme!', en: 'Mail me!' },
    'Get in Touch': { es: 'Ponte en Contacto', en: 'Get in Touch' },
    'Ponte en Contacto': { es: 'Ponte en Contacto', en: 'Get in Touch' },
    'I am currently looking for an internship or a permanent contract.': { es: 'Actualmente estoy buscando una prácticas o un contrato permanente.', en: 'I am currently looking for an internship or a permanent contract.' },
    'Actualmente estoy buscando una prácticas o un contrato permanente.': { es: 'Actualmente estoy buscando una prácticas o un contrato permanente.', en: 'I am currently looking for an internship or a permanent contract.' },
    'Your Name': { es: 'Tu Nombre', en: 'Your Name' },
    'Tu Nombre': { es: 'Tu Nombre', en: 'Your Name' },
    'Your Email': { es: 'Tu Email', en: 'Your Email' },
    'Tu Email': { es: 'Tu Email', en: 'Your Email' },
    'Subject': { es: 'Asunto', en: 'Subject' },
    'Asunto': { es: 'Asunto', en: 'Subject' },
    'Message': { es: 'Mensaje', en: 'Message' },
    'Mensaje': { es: 'Mensaje', en: 'Message' },
    'Send Message': { es: 'Enviar Mensaje', en: 'Send Message' },
    'Enviar Mensaje': { es: 'Enviar Mensaje', en: 'Send Message' },
    'Loading': { es: 'Cargando', en: 'Loading' },
    'Your message has been sent. Thank you!': { es: 'Tu mensaje ha sido enviado. ¡Gracias!', en: 'Your message has been sent. Thank you!' },
    'Tu mensaje ha sido enviado. ¡Gracias!': { es: 'Tu mensaje ha sido enviado. ¡Gracias!', en: 'Your message has been sent. Thank you!' },
    
    // Footer
    '© Copyright DevFolio. All Rights Reserved': { es: '© Copyright DevFolio. Todos los Derechos Reservados', en: '© Copyright DevFolio. All Rights Reserved' },
    '© Copyright DevFolio. Todos los Derechos Reservados': { es: '© Copyright DevFolio. Todos los Derechos Reservados', en: '© Copyright DevFolio. All Rights Reserved' },
    'Designed by BootstrapMade': { es: 'Diseñado por BootstrapMade', en: 'Designed by BootstrapMade' },
    'Diseñado por BootstrapMade': { es: 'Diseñado por BootstrapMade', en: 'Designed by BootstrapMade' }
  };
  
  // Apply translations to elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][currentLang]) {
      el.textContent = translations[key][currentLang];
    }
  });
  
  // Apply translations to placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] && translations[key][currentLang]) {
      el.placeholder = translations[key][currentLang];
    }
  });
  
  // Auto-translate all p, span, h1-h6, li, td, th elements
  translateElements(translations);
}

function translateElements(translations) {
  // Select all elements that might contain translatable text
  const selectors = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'label', 'div'];
  
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.textContent.trim();
      
      // Skip empty elements or elements with only whitespace
      if (!text || text.length < 2) return;
      
      // Skip elements with child elements (they might have specific structure)
      if (el.children.length > 0 && !el.querySelector('img, svg, i')) return;
      
      // Check if this text is in our translations dictionary
      if (translations[text] && translations[text][currentLang]) {
        el.textContent = translations[text][currentLang];
      }
    });
  });
  
  // Also translate input placeholders
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    const placeholder = el.getAttribute('placeholder');
    if (placeholder && translations[placeholder] && translations[placeholder][currentLang]) {
      el.setAttribute('placeholder', translations[placeholder][currentLang]);
    }
  });
}

// Make functions globally available
window.changeLanguage = changeLanguage;