import {
  Component, OnInit, OnDestroy, signal, computed,
  AfterViewInit, NgZone, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-40px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  navHidden = signal(false);
  menuOpen = signal(false);
  activeSection = signal('hero');
  typewriterText = signal('');
  contactForm = signal({ name: '', email: '', message: '' });
  visibleSections = signal<Set<string>>(new Set());
  lang = signal<'en' | 'es'>('en');

  lastScroll = 0;
  private typewriterInterval: any;
  private observer: IntersectionObserver | null = null;

  // ─── TRANSLATIONS ─────────────────────────────────────────────────────────
  readonly i18n = {
    en: {
      titles: ['Lead Software Engineer', '.NET & Angular Expert', 'Cloud & AI Architect', 'Engineering Leader'],
      nav: { about: 'About', skills: 'Skills', experience: 'Experience', education: 'Education', contact: 'Contact' },
      hero: {
        greeting: "Hello, I'm",
        bio: 'Lead Software Engineer with 15+ years building scalable enterprise software — from legacy systems to modern cloud-native architectures with AI.',
        cta1: 'Get in Touch', cta2: 'View Experience', scroll: 'Scroll'
      },
      about: {
        tag: 'Who I am', title: 'About', titleAccent: 'Me',
        p1: "I'm a Lead Software Engineer based in Cochabamba, Bolivia, with over 15 years of experience building and leading enterprise software — from legacy systems that needed careful modernization to greenfield projects using the latest cloud-native technologies.",
        p2: "I started my career as a developer and grew into a Lead role through consistent ownership, curiosity, and delivery. Along the way I've led micro frontend migrations, built microservices at scale, contributed to AI-powered platforms, and integrated Generative AI into real workflows.",
        p3: "As a Lead, I also do shadow management — supporting my team with planning, mentorship, and leadership. Helping people grow is something I take as seriously as the technical work.",
        location: 'Location', locationVal: 'Cochabamba, Bolivia',
        availability: 'Availability', availabilityVal: 'Open to opportunities',
        languages: 'Languages', languagesVal: 'Spanish · English · Quechua',
        degree: 'Degree', degreeVal: 'BSc System Engineering',
        langTitle: 'Languages'
      },
      stats: [
        { value: '15+', label: 'Years of Experience' },
        { value: '5+', label: 'Companies' },
        { value: '20+', label: 'Technologies' },
        { value: 'BSc', label: 'System Engineering' }
      ],
      langLevels: ['Native', 'Intermediate', 'Basic'],
      skills: { tag: 'What I know', title: 'Technical', titleAccent: 'Skills' },
      skillCategories: ['Frontend', 'Backend', 'Cloud & AWS', 'AI & Generative AI', 'Databases & Caching', 'DevOps & Architecture'],
      experience: { tag: "Where I've worked", title: 'Work', titleAccent: 'Experience' },
      expPeriods: [
        '2017 – Present · 8+ years',
        'Sep 2013 – Nov 2017 · 4 years',
        'Oct 2010 – Jul 2013 · 2 years 10 months'
      ],
      roles: [
        { title: 'Lead Software Engineer', period: 'Oct 2025 – Present',
          achievements: [
            'Leading technical direction, architecture decisions, and delivery quality for the enterprise platform.',
            'Acting as shadow manager: planning, cross-team coordination, and engineering management responsibilities.',
            'Driving adoption of Generative AI (Claude, GitHub Copilot) and LLM agents into product workflows.',
            'Mentoring engineers and fostering a culture of technical excellence and continuous learning.'
          ]
        },
        { title: 'Senior Software Engineer', period: 'May 2021 – Oct 2025',
          achievements: [
            'Led architectural migration from legacy ASP.NET monolith to micro frontend architecture with Angular.',
            'Designed and built new microservices using .NET Core integrated with Docker, Kubernetes, and AWS.',
            'Contributed to NAIA — an AI-powered emotion analysis platform for real-time customer call intelligence.',
            'Integrated AWS services (EC2, S3, SQS, SNS, Lambda, IAM, CloudWatch, Aurora) and Redis caching.'
          ]
        },
        { title: 'Software Engineer II', period: 'Nov 2017 – May 2021',
          achievements: [
            'Built web applications using ASP.NET, Angular (2–10), and microservices with .NET Core.',
            'Implemented Docker containers for microservice deployments and CI/CD pipelines with Jenkins.',
            'Integrated backend services with AWS infrastructure including EC2, S3, SQS, Lambda, and CloudWatch.'
          ]
        },
        { title: 'PHP & .NET Developer', period: '2013 – 2017',
          achievements: [
            'Built ERP systems for business clients covering inventory, procurement, finance, and operations.',
            'Developed electronic billing systems with fiscal integration (SIN) using SQL Server and Entity Framework.',
            'Implemented clinical records management systems for healthcare providers.',
            'Delivered distributed systems integrating multiple services across environments.'
          ]
        },
        { title: 'C# Developer', period: '2010 – 2013',
          achievements: [
            'Developed web and desktop applications using PHP, jQuery, CodeIgniter, and MySQL.',
            'Built enterprise systems with MVC .NET, C#, Silverlight, Windsor Castle, and SQL Server.'
          ]
        }
      ],
      education: { tag: 'My background', title: 'Education &', titleAccent: 'Certifications' },
      eduTitles: [
        'BSc System Engineering',
        'Full Stack Web Developer — Java & Angular JS',
        'Computer Maintenance & Repair'
      ],
      contact: {
        tag: "Let's talk", title: 'Get in', titleAccent: 'Touch',
        subtitle: 'Open to new opportunities, collaborations, or just a good conversation about tech.',
        emailLabel: 'Email', locationLabel: 'Location', locationVal: 'Cochabamba, Bolivia',
        linkedinLabel: 'LinkedIn', githubLabel: 'GitHub',
        formName: 'Your Name', formNamePh: 'John Doe',
        formEmail: 'Your Email', formEmailPh: 'john@example.com',
        formMessage: 'Message', formMessagePh: 'Tell me about the opportunity or just say hi...',
        formSubmit: 'Send Message →'
      },
      footer: 'Built with Angular · Marcos Bustos Jimenez © 2026'
    },
    es: {
      titles: ['Ingeniero de Software Lead', 'Experto en .NET & Angular', 'Arquitecto Cloud & IA', 'Líder de Ingeniería'],
      nav: { about: 'Sobre Mí', skills: 'Habilidades', experience: 'Experiencia', education: 'Educación', contact: 'Contacto' },
      hero: {
        greeting: 'Hola, soy',
        bio: 'Ingeniero de Software Lead con más de 15 años construyendo software empresarial escalable — desde sistemas legacy hasta arquitecturas cloud-native modernas con IA.',
        cta1: 'Contáctame', cta2: 'Ver Experiencia', scroll: 'Bajar'
      },
      about: {
        tag: 'Quién soy', title: 'Sobre', titleAccent: 'Mí',
        p1: 'Soy Ingeniero de Software Lead con base en Cochabamba, Bolivia, con más de 15 años de experiencia construyendo y liderando software empresarial — desde sistemas legacy que necesitaban modernización hasta proyectos nuevos con las últimas tecnologías cloud-native.',
        p2: 'Inicié mi carrera como desarrollador y llegué al rol de Lead a través de ownership constante, curiosidad y entrega de resultados. En el camino lideré migraciones a micro frontends, construí microservicios a escala, contribuí a plataformas con IA e integré IA Generativa en flujos de trabajo reales.',
        p3: 'Como Lead también realizo shadow management — apoyando al equipo con planificación, mentoría y liderazgo. Ayudar a que las personas crezcan es algo que tomo tan en serio como el trabajo técnico.',
        location: 'Ubicación', locationVal: 'Cochabamba, Bolivia',
        availability: 'Disponibilidad', availabilityVal: 'Abierto a oportunidades',
        languages: 'Idiomas', languagesVal: 'Español · Inglés · Quechua',
        degree: 'Título', degreeVal: 'Ing. de Sistemas',
        langTitle: 'Idiomas'
      },
      stats: [
        { value: '15+', label: 'Años de Experiencia' },
        { value: '5+', label: 'Empresas' },
        { value: '20+', label: 'Tecnologías' },
        { value: 'Ing.', label: 'Ing. de Sistemas' }
      ],
      langLevels: ['Nativo', 'Intermedio', 'Básico'],
      skills: { tag: 'Qué sé hacer', title: 'Habilidades', titleAccent: 'Técnicas' },
      skillCategories: ['Frontend', 'Backend', 'Cloud & AWS', 'IA & IA Generativa', 'Bases de Datos y Caché', 'DevOps y Arquitectura'],
      experience: { tag: 'Dónde he trabajado', title: 'Experiencia', titleAccent: 'Laboral' },
      expPeriods: [
        '2017 – Presente · 8+ años',
        'Sep 2013 – Nov 2017 · 4 años',
        'Oct 2010 – Jul 2013 · 2 años 10 meses'
      ],
      roles: [
        { title: 'Ingeniero de Software Lead', period: 'Oct 2025 – Presente',
          achievements: [
            'Liderando la dirección técnica, decisiones de arquitectura y calidad de entrega para la plataforma empresarial.',
            'Actuando como shadow manager: planificación, coordinación entre equipos y responsabilidades de gestión de ingeniería.',
            'Impulsando la adopción de IA Generativa (Claude, GitHub Copilot) y agentes LLM en flujos de trabajo del producto.',
            'Mentoring a ingenieros y fomentando una cultura de excelencia técnica y aprendizaje continuo.'
          ]
        },
        { title: 'Ingeniero de Software Senior', period: 'May 2021 – Oct 2025',
          achievements: [
            'Lideré la migración arquitectónica del monolito ASP.NET legacy a arquitectura de micro frontends con Angular.',
            'Diseñé e implementé nuevos microservicios con .NET Core integrados con Docker, Kubernetes y AWS.',
            'Contribuí a NAIA — plataforma de análisis de emociones con IA para inteligencia emocional en llamadas de clientes.',
            'Integré servicios AWS (EC2, S3, SQS, SNS, Lambda, IAM, CloudWatch, Aurora) y caché con Redis.'
          ]
        },
        { title: 'Ingeniero de Software II', period: 'Nov 2017 – May 2021',
          achievements: [
            'Desarrollé aplicaciones web con ASP.NET, Angular (2–10) y microservicios con .NET Core.',
            'Implementé contenedores Docker para despliegue de microservicios y pipelines CI/CD con Jenkins.',
            'Integré servicios backend con infraestructura AWS incluyendo EC2, S3, SQS, Lambda y CloudWatch.'
          ]
        },
        { title: 'Desarrollador PHP & .NET', period: '2013 – 2017',
          achievements: [
            'Desarrollé sistemas ERP para clientes empresariales cubriendo inventario, compras, finanzas y operaciones.',
            'Desarrollé sistemas de facturación con integración de facturación electrónica (SIN) usando SQL Server y Entity Framework.',
            'Implementé sistemas de gestión de historias clínicas para proveedores de salud.',
            'Entregué sistemas distribuidos integrando múltiples servicios entre entornos.'
          ]
        },
        { title: 'Desarrollador C#', period: '2010 – 2013',
          achievements: [
            'Desarrollé aplicaciones web y de escritorio usando PHP, jQuery, CodeIgniter y MySQL.',
            'Construí sistemas empresariales con MVC .NET, C#, Silverlight, Windsor Castle y SQL Server.'
          ]
        }
      ],
      education: { tag: 'Mi formación', title: 'Educación y', titleAccent: 'Certificaciones' },
      eduTitles: [
        'Ing. de Sistemas',
        'Desarrollador Full Stack — Java & Angular JS',
        'Mantenimiento y Reparación de Computadoras'
      ],
      contact: {
        tag: 'Hablemos', title: 'Ponte en', titleAccent: 'Contacto',
        subtitle: 'Abierto a nuevas oportunidades, colaboraciones o simplemente una buena conversación sobre tecnología.',
        emailLabel: 'Correo', locationLabel: 'Ubicación', locationVal: 'Cochabamba, Bolivia',
        linkedinLabel: 'LinkedIn', githubLabel: 'GitHub',
        formName: 'Tu Nombre', formNamePh: 'Juan Pérez',
        formEmail: 'Tu Correo', formEmailPh: 'juan@ejemplo.com',
        formMessage: 'Mensaje', formMessagePh: 'Cuéntame sobre la oportunidad o simplemente saluda...',
        formSubmit: 'Enviar Mensaje →'
      },
      footer: 'Hecho con Angular · Marcos Bustos Jimenez © 2026'
    }
  };

  t = computed(() => this.i18n[this.lang()]);

  navLinks = computed(() => [
    { label: this.t().nav.about, href: '#about' },
    { label: this.t().nav.skills, href: '#skills' },
    { label: this.t().nav.experience, href: '#experience' },
    { label: this.t().nav.education, href: '#education' },
    { label: this.t().nav.contact, href: '#contact' }
  ]);

  // ─── STATIC DATA ──────────────────────────────────────────────────────────
  readonly skillIcons = ['🖥️', '⚙️', '☁️', '🤖', '🗄️', '🚀'];
  readonly skillTags = [
    ['Angular (2–19)', 'TypeScript', 'JavaScript', 'RxJS', 'HTML5', 'CSS3', 'Angular Material', 'Bootstrap', 'Micro Frontends'],
    ['.NET Core', 'ASP.NET', 'C#', 'WCF', 'WPF', 'REST APIs', 'Microservices', 'Entity Framework', 'ORMs'],
    ['EC2', 'S3', 'SQS', 'SNS', 'Lambda', 'API Gateway', 'IAM', 'CloudWatch', 'RDS', 'Aurora', 'ECS'],
    ['LLM Integrations', 'AI Agents', 'Claude (Anthropic)', 'GitHub Copilot', 'Prompt Engineering', 'RAG', 'Workflow Automation'],
    ['SQL Server', 'Aurora MySQL', 'MySQL', 'PostgreSQL', 'Oracle', 'Redis', 'Query Optimization', 'Stored Procedures'],
    ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Clean Architecture', 'DDD', 'Design Patterns', 'Git']
  ];

  readonly experiences = [
    { company: 'NICE CXone', location: 'Cochabamba, Bolivia', roleIndices: [0, 1, 2] },
    { company: 'Freelance — System Engineer', location: 'Bolivia', roleIndices: [3] },
    { company: 'IdeaSoft', location: 'Cochabamba, Bolivia', roleIndices: [4] }
  ];

  readonly education = [
    { type: 'degree', institution: 'Universidad Mayor de San Simón', location: 'Cochabamba, Bolivia', year: '' },
    { type: 'cert',   institution: 'Digital Harbor', location: '', year: '2017' },
    { type: 'cert',   institution: 'Institute ING-DATA-COM', location: '', year: '2004' }
  ];

  readonly languagesPct = [100, 60, 25];

  readonly particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 6,
    size: 2 + Math.random() * 4
  }));

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTypewriter();
      this.listenScroll();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }

  ngOnDestroy() {
    clearInterval(this.typewriterInterval);
    this.observer?.disconnect();
  }

  setLang(l: 'en' | 'es') {
    this.lang.set(l);
    clearInterval(this.typewriterInterval);
    this.typewriterText.set('');
    this.startTypewriter();
  }

  private startTypewriter() {
    let titleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseCount = 0;

    this.typewriterInterval = setInterval(() => {
      const titles = this.t().titles;
      const current = titles[titleIdx % titles.length];

      if (pauseCount > 0) { pauseCount--; return; }

      if (!deleting) {
        charIdx++;
        this.typewriterText.set(current.slice(0, charIdx));
        if (charIdx === current.length) { deleting = true; pauseCount = 22; }
      } else {
        charIdx--;
        this.typewriterText.set(current.slice(0, charIdx));
        if (charIdx === 0) { deleting = false; titleIdx = (titleIdx + 1) % titles.length; }
      }
    }, 80);
  }

  private listenScroll() {
    window.addEventListener('scroll', () => {
      this.ngZone.run(() => {
        const current = window.scrollY;
        this.navHidden.set(current > this.lastScroll && current > 80);
        this.lastScroll = current;
      });
    }, { passive: true });
  }

  private initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        this.ngZone.run(() => {
          entries.forEach(entry => {
            const id = entry.target.id;
            const current = new Set(this.visibleSections());
            if (entry.isIntersecting) { current.add(id); this.activeSection.set(id); }
            this.visibleSections.set(current);
          });
        });
      },
      { threshold: 0.15 }
    );
    ['about', 'skills', 'experience', 'education', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer!.observe(el);
    });
  }

  isSectionVisible(id: string): boolean {
    return this.visibleSections().has(id);
  }

  scrollTo(href: string) {
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen.set(false);
  }

  updateForm(field: string, value: string) {
    this.contactForm.update(f => ({ ...f, [field]: value }));
  }

  submitForm() {
    const { name, email, message } = this.contactForm();
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:marbusjim@gmail.com?subject=${subject}&body=${body}`;
  }
}
