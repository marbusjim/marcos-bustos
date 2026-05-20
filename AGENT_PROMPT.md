# Portfolio Landing Page — Agent Prompt

Este archivo documenta el prompt completo utilizado para generar este proyecto con Claude Code.

---

## Prompt original

```
# Genera mi Landing Page de CV/Portafolio Personal

## Instrucciones para el asistente

Primero, lee el archivo de CV que adjunto (puede ser PDF o Word/.docx) y extrae toda la información relevante: datos
personales, experiencia laboral, educación, certificaciones, skills, idiomas, etc. Usa esa información para poblar
todas las secciones de la landing page.

Si el documento no contiene algún dato requerido (como foto, links sociales, o títulos para el typewriter), pregúntame
antes de continuar.

---

## ARQUITECTURA TÉCNICA

Crea una landing page de portafolio profesional usando **Angular 19** con la siguiente arquitectura:
- Componente único (app.ts, app.html, app.scss)
- Angular signals para estado reactivo
- SCSS con variables CSS en `:root` para theming
- Animaciones Angular (fadeInUp, fadeInLeft, scaleIn, staggerIn, bounceIn)
- CSS keyframes para partículas flotantes, efecto typewriter, y pulse-glow
- Intersection Observer para activar animaciones al hacer scroll
- Navbar con glassmorphism que se oculta/muestra al hacer scroll
- Diseño responsive (mobile hamburger menu, grid adaptativo)
- Formulario de contacto con EmailJS (con fallback a mailto)
- Google Fonts: Inter (body) + JetBrains Mono (typewriter)
- Soporte bilingüe EN/ES con switcher en la navbar usando Angular signals

### Secciones requeridas:
1. **Hero** - Efecto typewriter con títulos rotatorios, foto de perfil con animación glow, partículas flotantes,
botones CTA, links sociales
2. **About** - Bio, stats cards, info grid (ubicación, idiomas, disponibilidad)
3. **Skills** - Categorías con iconos y tags
4. **Experience** - Timeline vertical con empresas, periodos, logros
5. **Education & Certifications** - Layout dos columnas
6. **Contact** - Cards de info + formulario funcional

---

## MI CV (adjunto)

He adjuntado mi CV en formato PDF.

Extrae de este documento:
- Nombre completo y datos de contacto
- Resumen profesional / bio
- Toda la experiencia laboral (empresa, cargo, periodo, logros)
- Educación (títulos, instituciones, años)
- Certificaciones
- Skills/tecnologías
- Idiomas
- Cualquier otro dato relevante

### Datos adicionales:
- Títulos para el typewriter (EN): Lead Software Engineer / .NET & Angular Expert / Cloud & AI Architect / Engineering Leader
- Títulos para el typewriter (ES): Ingeniero de Software Lead / Experto en .NET & Angular / Arquitecto Cloud & IA / Líder de Ingeniería
- LinkedIn URL: https://www.linkedin.com/in/marcos-bustos-209238a9/
- GitHub URL: https://github.com/marbusjim
- Foto de perfil: profile.jpg
- Disponibilidad: Open to opportunities / Abierto a oportunidades

### Stats destacados:
1. 15+ años de experiencia
2. 5+ empresas
3. 20+ tecnologías
4. BSc System Engineering

### EmailJS:
- No configurado — usar fallback a mailto:marbusjim@gmail.com

---

## DISEÑO Y COLORES

### Paleta: Ocean Blue
- Fondo: `#0b1628`
- Acento primario: `#0ea5e9`
- Acento secundario (gradiente): `#06b6d4`
- Texto principal: `#e2e8f0`

### Estilo visual: Glassmorphism
- Cards con blur y transparencia

### Forma de las cards: Redondeadas (border-radius: 16px)

### Efecto Hero: Partículas flotantes

---

## RESULTADO ESPERADO

Genera los archivos completos:
1. `src/app/app.ts` - Componente con datos extraídos del CV, lógica, signals, i18n EN/ES y animaciones
2. `src/app/app.html` - Template con todas las secciones, switcher de idioma en navbar
3. `src/app/app.scss` - Estilos con Ocean Blue glassmorphism + responsive + lang-switcher
4. `src/styles.scss` - Variables CSS globales y reset
5. `src/index.html` - Con Google Fonts y meta tags
6. `package.json` - Dependencias necesarias
7. `angular.json` - Configuración del proyecto con baseHref `/marcos-bustos-dev/`
8. `.github/workflows/deploy.yml` - Workflow de GitHub Actions para deploy a GitHub Pages
9. `public/404.html` - Redirect para SPA routing en GitHub Pages

### Repositorio GitHub:
- Nombre: `marcos-bustos-dev`
- Usuario: `marbusjim`
- URL final: `https://marbusjim.github.io/marcos-bustos-dev/`

### Configuración en GitHub:
- Settings → Pages → Source: GitHub Actions
- El baseHref en angular.json debe ser `/marcos-bustos-dev/`
- El path del artifact en el workflow debe apuntar a `dist/marcos-bustos-dev/browser`

---

## NOTAS DE IMPLEMENTACIÓN

- Toda la traducción EN/ES se maneja con un objeto `i18n` dentro del componente usando `signal<'en'|'es'>` y `computed()`
- El typewriter reinicia automáticamente al cambiar de idioma
- Los emails en el template deben escaparse como `&#64;` para evitar el error NG5002 de Angular
- La propiedad `lastScroll` debe ser pública (no `private`) para poder usarla en el template
- El switcher de idioma va en `.nav-right` junto al hamburger, visible en desktop y mobile
```

---

## Ajustes y mejoras aplicadas durante la sesión

1. **Fix email Angular NG5002** — `@` escapado como `&#64;` en todos los `href` y texto del template
2. **Fix `lastScroll` private** — cambiado a propiedad pública para uso en template
3. **i18n bilingüe completo** — todo el contenido traducido: navbar, hero, about, skills, experience, education, contact, footer, typewriter
4. **Pausa en typewriter** — agregado `pauseCount` para que el texto se detenga antes de borrar
5. **Responsive lang-switcher** — visible tanto en desktop como en mobile junto al hamburger

---

## Comandos útiles

```bash
# Instalar dependencias
npm install --registry https://registry.npmjs.org

# Servidor de desarrollo
npx ng serve

# Build de producción
npx ng build --configuration production

# El sitio queda en:
# http://localhost:4200 (dev)
# https://marbusjim.github.io/marcos-bustos-dev/ (producción)
```
