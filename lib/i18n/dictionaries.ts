import type { Language } from '@/lib/i18n/config'

export const dictionaries = {
  es: {
    languageSwitcher: {
      ariaLabel: 'Cambiar idioma',
      label: 'Idioma',
      spanish: 'Español',
      english: 'Inglés',
      saving: 'Guardando...',
    },
    header: {
      dashboard: 'Dashboard',
      apply: 'Aplicar',
      login: 'Acceder',
      createAccount: 'Crear cuenta',
      signOut: 'Salir',
      logoAlt: 'Xclusive Barber Academy Logo',
      brandAlt: 'Xclusive Barber Academy',
    },
    dashboardHeader: {
      dashboard: 'Dashboard',
    },
    dashboardPageHeader: {
      dashboard: 'Dashboard',
      brandAlt: 'Xclusive Barber Academy',
      dividerAlt: 'Línea divisora',
    },
    dashboardQualifyPage: {
      headerTitle: 'Calificación Inicial',
      stepLabel: 'Paso 2 de 2',
      title: 'Queremos conocer tu nivel de compromiso',
      subtitle:
        'Este formulario toma menos de 3 minutos. Nos ayuda a evaluar tu perfil y darte seguimiento personalizado dentro del proceso de admisión.',
      footerTagline: 'Xclusive Barber Academy',
    },
    userMenu: {
      welcome: 'Bienvenido',
      defaultName: 'Estudiante',
      profileAlt: 'Perfil',
      fallbackEmail: 'usuario@email.com',
      professionalProgress: 'Progreso profesional',
      signOut: 'Cerrar sesión',
    },
    loginPage: {
      back: 'Volver',
      titleLineOne: 'ACCEDE A LA',
      titleLineTwo: 'ACADEMIA',
      subtitle: 'Acceso exclusivo para estudiantes activos.',
      welcomeTitle: '¡Bienvenido a Xclusive Barber Academy!',
      welcomeBody:
        'Ingresa para acceder a tus clases, contenidos exclusivos y seguimiento académico.',
      emailPlaceholder: 'CORREO ELECTRÓNICO',
      passwordPlaceholder: 'CONTRASEÑA',
      forgotPassword: '¿OLVIDASTE TU CONTRASEÑA?',
      submit: 'ACCEDER A MI FORMACIÓN',
      firstAccessPrefix: '¿ES TU PRIMER INGRESO?',
      activateAccount: 'ACTIVAR CUENTA',
      issuesLine: '¿TIENES PROBLEMAS PARA INGRESAR?',
      contact: 'CONTÁCTANOS',
      footerTagline: 'Formación profesional para construir una carrera real.',
    },
    applyForm: {
      pending: 'PROCESANDO...',
      submit: 'ACTIVAR CUENTA',
      fullNamePlaceholder: 'NOMBRE',
      emailPlaceholder: 'CORREO ELECTRÓNICO',
      inviteCodePlaceholder: 'CÓDIGO DE ACCESO',
      passwordPlaceholder: 'CREAR CONTRASEÑA',
    },
    qualifyPage: {
      stepLabel: 'Paso 1 de 2',
      title: 'Queremos conocer tu nivel de compromiso',
      subtitle:
        'Completa este wizard para que el equipo comercial te contacte y te guie con la compra del acceso.',
      helper:
        'Si aun no dejaste tu telefono, vuelve al landing y registralo primero para continuar.',
      backToLanding: 'Volver al landing',
      footerTagline: 'Xclusive Barber Academy',
    },
    qualifyForm: {
      sending: 'ENVIANDO...',
      finish: 'FINALIZAR Y CONTINUAR',
      requiredQuestion: 'Esta pregunta es obligatoria.',
      seriousnessRange: 'Selecciona un valor entre 1 y 10.',
      answerPlaceholder: 'Escribe tu respuesta aquí...',
      step: 'Paso',
      back: 'Volver',
      continue: 'Continuar',
      stepPrefix: 'Paso',
      hintSeriousness: 'Selecciona un número del 1 al 10.',
      steps: {
        citySuburb: '¿En qué ciudad o suburbio vives actualmente?*',
        hasCutHairBefore: '¿Has cortado cabello antes?*',
        mainGoal: '¿Cuál es tu objetivo principal al completar la academia?*',
        consideredOtherPrograms:
          '¿Habías considerado otros programas de barbería antes de aplicar?*',
        seriousness: '¿Qué tan serio estás sobre convertirte en barbero?*',
        incomeGoal: '¿Qué ingreso te gustaría alcanzar como barbero?*',
        followsBarberPages: '¿Sigues barberos o páginas de barbería actualmente?*',
        financialPreparedness: '¿Estás preparado financieramente para invertir en tu educación?*',
        careerStartWindow: '¿Cuándo quieres iniciar tu carrera de barbería?*',
        longTermAmbition: '¿Tienes ambiciones a largo plazo en la industria?*',
        callWillingness:
          'Si eres aceptado, ¿estarías dispuesto a una llamada corta con el equipo?*',
      },
      options: {
        yes: 'Sí',
        no: 'No',
        income50to70: '$50k - $70k',
        income70to100: '$70k - $100k',
        income100plus: '$100k+',
        ownShop: 'Abrir mi propio negocio',
        needPaymentPlan: 'Necesito opción de plan de pago',
        notYet: 'Aún no',
        immediately: 'Inmediatamente',
        within3Months: 'Dentro de 3 meses',
        within6Months: 'Dentro de 6 meses',
        researching: 'Solo investigando',
        seniorBarber: 'Convertirme en barbero senior',
        openShop: 'Abrir mi negocio',
        personalBrand: 'Construir marca personal',
        educator: 'Ser educador',
        notSure: 'Aún no lo tengo claro',
        maybe: 'Tal vez',
      },
    },
    landing: {
      hero: {
        subtitle: 'EDUCACION PROFESIONAL EN BARBERIA EN MELBOURNE',
        headingTop: 'FORMACION ORIENTADA A LOS ESTANDARES REALES DEL',
        headingBottom: 'MERCADO AUSTRALIANO',
        paragraph:
          'Sistema de aprendizaje practico y estructurado para construir una carrera real, con estandares profesionales y mentalidad de negocio.',
        armAlt: 'Barber profesional',
      },
      targetAudience: {
        ctaTitle: 'LISTO PARA DAR EL SIGUIENTE PASO?',
        subtitle:
          'Entrenamos barberos con disciplina y vision de negocio para el mercado australiano.',
        cardTitle: 'XCLUSIVE BARBER ACADEMY ES PARA',
        items: [
          'Cualquier persona en Melbourne que quiera aprender barberia de forma practica y profesional.',
          'Migrantes, incluida la comunidad latina, que buscan estabilidad y crecimiento a traves de un oficio real.',
          'Barberos principiantes o intermedios que quieren subir su nivel.',
        ],
        logoAlt: 'Xclusive Barber Academy',
      },
      features: {
        headingTop: 'FORMAMOS',
        headingBottom: 'PROFESIONALES',
        cards: [
          {
            title: 'MENTALIDAD PROFESIONAL',
            description:
              'Disciplina, puntualidad, trato al cliente y presentacion personal como parte del proceso.',
          },
          {
            title: 'FORMACION PRACTICA REAL',
            description:
              'Aprendes haciendo, con correccion constante y estandares reales del mercado australiano.',
          },
          {
            title: 'ENFOQUE EN CARRERA Y NEGOCIO',
            description:
              'No solo tecnica: preparacion para el mundo laboral y bases de mentalidad emprendedora.',
          },
        ],
        titles: {
          mindset: 'Mentalidad Profesional',
          practice: 'Formacion Practica Real',
          career: 'Enfoque en Carrera y Negocio',
        },
      },
      missionVision: {
        missionTitle: 'MISION',
        visionTitle: 'VISION',
        missionAlt: 'Mision',
        visionAlt: 'Vision',
        missionText:
          'Formar barberos con nivel profesional, disciplina y mentalidad de crecimiento, capaces de insertarse laboralmente en Australia y construir estabilidad economica a traves de una habilidad real. No formamos solo tecnicos, formamos personas con criterio, etica y vision de futuro.',
        visionText:
          'Construir una de las academias de barberia mas solidas de Melbourne, con raices en la comunidad latina y proyeccion hacia todo el mercado australiano, alianzas estrategicas, programas formativos mas amplios e impacto real en la vida de quienes confian en este proceso.',
      },
      instructor: {
        academyLabel: 'XCLUSIVE BARBER ACADEMY',
        name: 'JULIAN',
        subtitle: 'Una academia creada desde la experiencia real',
        description:
          'Xclusive Barber Academy nace desde la experiencia directa de su fundador como migrante, barbero profesional y emprendedor en Australia.',
        imageAlt: 'Julian Giraldo - Fundador de Xclusive Barber Academy',
      },
      finalCta: {
        titleLineOne: 'LISTO PARA DAR EL',
        titleLineTwo: 'SIGUIENTE PASO?',
        description:
          'Si estas buscando algo serio, estructurado y con proyeccion real, puedes aplicar a la academia y comenzar el proceso.',
        button: 'APLICAR A LA ACADEMIA',
        buttonAlt: 'Boton aplicar',
      },
      pricing: {
        plans: [
          {
            id: 'starter',
            name: 'EXPERIENCIA BARBER STARTER',
            priceLabel: '$300',
            billingLabel: 'AUD',
            hook: 'Descubre si la barberia es lo tuyo antes de dar el siguiente paso.',
            formatLabel: '3 clases presenciales',
            description:
              'Vive tu primera experiencia en barberia dentro de un entorno real. Aprende lo basico, haz tu primeros corte y entiende como funciona esta profesion.',
            benefits: [
              'Fundamentos esenciales',
              'Uso de herramientas',
              'Primeros corte guiados',
              'Experiencia real en barberia',
              'Feedback',
            ],
            ctaLabel: 'Reservar cupo',
          },
          {
            id: 'profesional',
            name: 'PROGRAMA PROFESIONAL XCLUSIVE',
            priceLabel: '$3,500 (early) / $4,000',
            billingLabel: 'AUD',
            hook: 'Conviertete en barbero profesional en 12 semanas.',
            formatLabel: 'Presencial - 12 semanas 80% practico 20% teorico',
            description:
              'Formacion completa para llevarte de cero a profesional. Aprendes tecnicas reales avanzadas, trabajas con clientes y te preparas para generar una habilidad que puede cambiarte la vida. Nuestro curso esta disenado por modulos con una duracion de alrededor de 100 horas de practica.',
            benefits: [
              'Higiene de la babera, fades, tijera, barba y estilos modernos',
              'Practica con clientes reales',
              'Kit profesional + uniforme',
              'Certificado privado',
            ],
            ctaLabel: 'Aplicar ahora',
          },
          {
            id: 'elite',
            name: 'MENTORIA ELITE XCLUSIVE',
            priceLabel: '$400 - $1,500',
            billingLabel: 'AUD',
            hook: 'Entrena directo conmigo y lleva tu profesion a otro nivel.',
            formatLabel: '1 a 1 presencial',
            description:
              'Programa personalizado para barberos que quieren mejorar rapido, corregir errores y posicionarse como profesionales de alto nivel.',
            benefits: [
              'Diagnostico personalizado',
              'Correccion tecnica en tiempo real',
              'Plan de mejora',
              'Estrategia profesional',
            ],
            ctaLabel: 'Aplicar a mentoria',
          },
          {
            id: 'business',
            name: 'EXPERIENCIA BARBER BUSINESS',
            priceLabel: '$400 - $700',
            billingLabel: 'AUD',
            hook:
              'Aprende a ganar dinero en la industria de barberia y no solo de cortando cabello.',
            formatLabel: 'Workshop presencial',
            description:
              'Descubre como conseguir clientes, cobrar mejor y crecer como barbero en el mundo real, marketing de barbero, como posicionarte como referente.',
            benefits: [
              'Estrategias para atraer clientes',
              'Como subir precios',
              'Marca personal',
              'Experiencia real del negocio',
            ],
            ctaLabel: 'Reservar cupo',
          },
        ],
        instagramAlt: 'Instagram',
        logoAlt: 'Xclusive Barber Academy',
        whatsappAlt: 'WhatsApp',
      },
      flowGate: {
        unlockTitle: 'Desbloquea el contenido',
        unlockDescription: 'Deja tu correo y telefono para ver toda la informacion.',
        submitLabel: 'OBTENER MAS INFORMACION',
      },
      phoneCapture: {
        pending: 'ENVIANDO...',
        countryCodeLabel: 'Extension de pais',
        emailLabel: 'Correo',
        emailPlaceholder: 'TU CORREO',
        phoneLabel: 'Telefono',
        phonePlaceholder: 'TU TELEFONO',
        success:
          'Gracias. Recibimos tu contacto. Puedes seguir explorando nuestros cursos.',
        helper: 'Necesitamos tu correo y telefono para continuar.',
        defaultSubmit: 'OBTENER MAS INFORMACION',
      },
      premiumCapture: {
        quickContact: 'Contacto rapido',
        heading: 'Deja tu telefono y recibe orientacion para elegir el curso ideal.',
      },
    },
    actions: {
      apply: {
        invalidEmail: 'Correo electrónico inválido.',
        invalidPassword: 'La contraseña debe tener al menos 6 caracteres.',
        invalidName: 'Nombre inválido.',
        nameTooLong: 'Nombre demasiado largo.',
        invalidInviteCode: 'Código de acceso inválido.',
        invalidForm: 'Datos del formulario inválidos.',
        inviteExpired: 'Código de acceso inválido o expirado.',
        activationError: 'Error al activar tu cuenta. Por favor intenta nuevamente.',
        rateLimited: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
      },
      login: {
        invalidCredentials: 'Credenciales incorrectas',
      },
      landing: {
        invalidEmail: 'Correo electronico invalido.',
        phoneRequired: 'Ingresa un teléfono válido.',
        invalidPhone: 'Teléfono inválido.',
        invalidCountryCode: 'Código de país inválido.',
        invalidData: 'Datos inválidos.',
        phoneWithCountryCode: 'Ingresa un teléfono válido con código de país.',
        registerFailed: 'No pudimos registrar tu contacto. Intenta nuevamente.',
        migrationMissing:
          'No pudimos registrar tu contacto porque la base de datos aún no tiene habilitado el flujo de pre-leads. Ejecuta la migración 2026-04-01-prelead-phone-capture.sql.',
        duplicatePhone:
          'Este telefono ya fue registrado. Usa otro telefono o continua con el proceso de aplicacion.',
        duplicateEmail: 'Este correo ya fue registrado. Usa otro correo para continuar.',
        rateLimited: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
      },
      qualifyPublic: {
        missingTrackedPhone:
          'Primero deja tu teléfono en la landing para iniciar el proceso.',
        invalidForm: 'Formulario inválido.',
        rateLimited: 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
        qualificationSaveError: 'No pudimos guardar tu calificación. Intenta nuevamente.',
        answersPartialError:
          'Guardamos parte de tu información, pero hubo un error en respuestas.',
        defaultWhatsappMessage:
          'Estoy interesado en ser parte de la academia, quiero inscribirme ya.',
        selectedPlanMessage:
          'Hola equipo Xclusive, acabo de completar el formulario y me interesa el plan {{plan}}. Quiero avanzar con mi inscripción.',
        planLabels: {
          starter: 'EXPERIENCIA BARBER STARTER',
          profesional: 'PROGRAMA PROFESIONAL XCLUSIVE',
          elite: 'MENTORIA ELITE XCLUSIVE',
          business: 'EXPERIENCIA BARBER BUSINESS',
        },
      },
      qualifyDashboard: {
        mustLogin: 'Debes iniciar sesión para completar este paso.',
        profileMissing: 'No pudimos encontrar tu perfil.',
        invalidForm: 'Formulario inválido.',
        invalidEmail: 'Tu cuenta no tiene email válido.',
        qualificationSaveError: 'No pudimos guardar tu calificación. Intenta de nuevo.',
        answersPartialError:
          'Guardamos parte de tu información, pero hubo un error en respuestas.',
      },
      tracker: {
        descriptionMin: 'La descripción debe tener al menos 10 caracteres.',
        descriptionMax: 'La descripción no puede superar 1000 caracteres.',
        imageRequired: 'La imagen es obligatoria.',
        fileTooLarge: 'El archivo supera el límite de {{sizeMb}} MB.',
        invalidMimeType:
          'Tipo de archivo no permitido: {{mimeType}}. Solo se aceptan imágenes.',
        invalidExtension:
          'Extensión no permitida: .{{extension}}. Solo se aceptan imágenes.',
        invalidForm: 'Datos del formulario no válidos.',
        uploadStorageError: 'Error subiendo imagen a Storage.',
        saveDbError: 'No se pudo guardar la práctica. Intenta nuevamente.',
        unauthenticated: 'Usuario no autenticado.',
        notFoundOrForbidden: 'Práctica no encontrada o no tienes permiso para eliminarla.',
        deleteFailed: 'No se pudo eliminar la práctica.',
      },
      grading: {
        unauthenticated: 'No estás autenticado.',
        instructorOnly: 'No tienes permisos de instructor para realizar esta acción.',
        submissionMissing: 'No se encontró el envío o no tienes permiso para verlo.',
        manualPending: 'Feedback manual pendiente.',
        aiError: 'No se pudo generar feedback automático.',
        unexpectedError: 'Ocurrió un error inesperado en el servidor.',
        saveFailed: 'Error al guardar la calificación. Intenta nuevamente.',
      },
      adminCourses: {
        createModuleError: 'No se pudo crear el módulo.',
        reorderInvalidData: 'Datos inválidos para reordenar lecciones.',
        reorderDuplicate: 'Hay lecciones duplicadas en el nuevo orden.',
        reorderMismatch: 'El orden recibido no coincide con el módulo seleccionado.',
      },
      adminUsers: {
        invalidLeadPhone: 'Teléfono de lead inválido.',
        leadPhoneNotFound: 'No existe teléfono asociado a ese lead.',
        unauthorizedUser: 'No autorizado: debes iniciar sesión.',
        unauthorizedAdmin: 'No autorizado: solo administradores.',
      },
      crmScoring: {
        readyToInvest: 'Listo para invertir en su formación',
        startImmediately: 'Busca iniciar de inmediato',
        callAvailable: 'Disponible para llamada de admisión',
        ownBusinessGoal: 'Meta de abrir su propio negocio',
      },
      openai: {
        fallbackShort: 'Sigue practicando, buen trabajo.',
        fallbackDetailed:
          'Excelente esfuerzo. Revisa los detalles de simetría y limpieza para la próxima.',
      },
    },
  },
  en: {
    languageSwitcher: {
      ariaLabel: 'Change language',
      label: 'Language',
      spanish: 'Spanish',
      english: 'English',
      saving: 'Saving...',
    },
    header: {
      dashboard: 'Dashboard',
      apply: 'Apply',
      login: 'Login',
      createAccount: 'Create account',
      signOut: 'Sign out',
      logoAlt: 'Xclusive Barber Academy Logo',
      brandAlt: 'Xclusive Barber Academy',
    },
    dashboardHeader: {
      dashboard: 'Dashboard',
    },
    dashboardPageHeader: {
      dashboard: 'Dashboard',
      brandAlt: 'Xclusive Barber Academy',
      dividerAlt: 'Divider line',
    },
    dashboardQualifyPage: {
      headerTitle: 'Initial Qualification',
      stepLabel: 'Step 2 of 2',
      title: 'We want to know your commitment level',
      subtitle:
        'This form takes less than 3 minutes. It helps us evaluate your profile and provide personalized follow-up in your admissions process.',
      footerTagline: 'Xclusive Barber Academy',
    },
    userMenu: {
      welcome: 'Welcome',
      defaultName: 'Student',
      profileAlt: 'Profile',
      fallbackEmail: 'user@email.com',
      professionalProgress: 'Professional progress',
      signOut: 'Sign out',
    },
    loginPage: {
      back: 'Back',
      titleLineOne: 'ACCESS THE',
      titleLineTwo: 'ACADEMY',
      subtitle: 'Exclusive access for active students.',
      welcomeTitle: 'Welcome to Xclusive Barber Academy!',
      welcomeBody:
        'Sign in to access your classes, exclusive content, and academic tracking.',
      emailPlaceholder: 'EMAIL',
      passwordPlaceholder: 'PASSWORD',
      forgotPassword: 'FORGOT YOUR PASSWORD?',
      submit: 'ACCESS MY TRAINING',
      firstAccessPrefix: 'IS THIS YOUR FIRST ACCESS?',
      activateAccount: 'ACTIVATE ACCOUNT',
      issuesLine: 'HAVING TROUBLE SIGNING IN?',
      contact: 'CONTACT US',
      footerTagline: 'Professional training to build a real career.',
    },
    applyForm: {
      pending: 'PROCESSING...',
      submit: 'ACTIVATE ACCOUNT',
      fullNamePlaceholder: 'FULL NAME',
      emailPlaceholder: 'EMAIL',
      inviteCodePlaceholder: 'ACCESS CODE',
      passwordPlaceholder: 'CREATE PASSWORD',
    },
    qualifyPage: {
      stepLabel: 'Step 1 of 2',
      title: 'We want to know your commitment level',
      subtitle:
        'Complete this wizard so our admissions team can contact you and guide your purchase process.',
      helper:
        'If you have not shared your phone yet, go back to the landing page and register first.',
      backToLanding: 'Back to landing',
      footerTagline: 'Xclusive Barber Academy',
    },
    qualifyForm: {
      sending: 'SENDING...',
      finish: 'FINISH AND CONTINUE',
      requiredQuestion: 'This question is required.',
      seriousnessRange: 'Choose a value between 1 and 10.',
      answerPlaceholder: 'Type your answer here...',
      step: 'Step',
      back: 'Back',
      continue: 'Continue',
      stepPrefix: 'Step',
      hintSeriousness: 'Select a number from 1 to 10.',
      steps: {
        citySuburb: 'City/Suburb you currently live in?*',
        hasCutHairBefore: 'Have you ever cut hair before?*',
        mainGoal: 'What is your main goal after completing the academy?*',
        consideredOtherPrograms: 'Have you considered other barber programs before applying?*',
        seriousness: 'How serious are you about becoming a barber?*',
        incomeGoal: 'What income would you like to be earning as a barber?*',
        followsBarberPages: 'Do you currently follow barbers or barbering pages online?*',
        financialPreparedness: 'Are you financially prepared to invest in your education?*',
        careerStartWindow: 'When are you looking to start your barber career?*',
        longTermAmbition: 'Do you have long-term ambitions in the barber industry?*',
        callWillingness:
          'If accepted, are you willing to jump on a short call with our team?*',
      },
      options: {
        yes: 'Yes',
        no: 'No',
        income50to70: '$50k - $70k',
        income70to100: '$70k - $100k',
        income100plus: '$100k+',
        ownShop: 'Open my own shop',
        needPaymentPlan: 'I need a payment plan option',
        notYet: 'Not yet',
        immediately: 'Immediately',
        within3Months: 'Within 3 months',
        within6Months: 'Within 6 months',
        researching: 'Just researching',
        seniorBarber: 'Become a senior barber',
        openShop: 'Open my own shop',
        personalBrand: 'Build a personal brand',
        educator: 'Become an educator',
        notSure: 'Not sure yet',
        maybe: 'Maybe',
      },
    },
    landing: {
      hero: {
        subtitle: 'PROFESSIONAL BARBER EDUCATION IN MELBOURNE',
        headingTop: 'TRAINING ALIGNED WITH REAL STANDARDS OF THE',
        headingBottom: 'AUSTRALIAN MARKET',
        paragraph:
          'A practical and structured learning system to build a real career, with professional standards and business mindset.',
        armAlt: 'Professional barber',
      },
      targetAudience: {
        ctaTitle: 'READY FOR THE NEXT STEP?',
        subtitle:
          'We train barbers with discipline and business mindset for the Australian market.',
        cardTitle: 'XCLUSIVE BARBER ACADEMY IS FOR',
        items: [
          'Anyone in Melbourne who wants to learn barbering the practical, professional way.',
          'Migrants, including the Latino community, seeking stability and growth through a real trade.',
          'Beginner or intermediate barbers ready to level up.',
        ],
        logoAlt: 'Xclusive Barber Academy',
      },
      features: {
        headingTop: 'WE TRAIN',
        headingBottom: 'PROFESSIONALS',
        cards: [
          {
            title: 'PROFESSIONAL MINDSET',
            description:
              'Discipline, punctuality, customer care, and personal presentation as part of the process.',
          },
          {
            title: 'REAL PRACTICAL TRAINING',
            description:
              'You learn by doing, with constant correction and standards aligned to the Australian market.',
          },
          {
            title: 'CAREER AND BUSINESS FOCUS',
            description:
              'Not only technique: preparation for real employment and entrepreneurial mindset.',
          },
        ],
        titles: {
          mindset: 'Professional Mindset',
          practice: 'Real Practical Training',
          career: 'Career and Business Focus',
        },
      },
      missionVision: {
        missionTitle: 'MISSION',
        visionTitle: 'VISION',
        missionAlt: 'Mission',
        visionAlt: 'Vision',
        missionText:
          'Train barbers with professional level, discipline, and growth mindset, capable of entering the Australian workforce and building economic stability through a real skill. We do not train only technicians, we build people with criteria, ethics, and future vision.',
        visionText:
          'Build one of the strongest barber academies in Melbourne, rooted in the Latino community and reaching the broader Australian market, with long-term projection, strategic partnerships, broader training programs, and real impact on the lives of those who trust this process.',
      },
      instructor: {
        academyLabel: 'XCLUSIVE BARBER ACADEMY',
        name: 'JULIAN',
        subtitle: 'An academy built from real experience',
        description:
          'Xclusive Barber Academy was born from the direct experience of its founder as a migrant, professional barber, and entrepreneur in Australia.',
        imageAlt: 'Julian Giraldo - Founder of Xclusive Barber Academy',
      },
      finalCta: {
        titleLineOne: 'READY FOR THE',
        titleLineTwo: 'NEXT STEP?',
        description:
          'If you are looking for a serious, structured program with real projection, you can apply to the academy and start the process.',
        button: 'APPLY TO THE ACADEMY',
        buttonAlt: 'Apply button',
      },
      pricing: {
        plans: [
          {
            id: 'starter',
            name: 'BARBER STARTER EXPERIENCE',
            priceLabel: '$300',
            billingLabel: 'AUD',
            hook: 'Find out if barbering is right for you before taking the next step.',
            formatLabel: '3 in-person classes',
            description:
              'Get your first taste of barbering in a real environment. Learn the basics, do your first cuts, and understand how this profession works.',
            benefits: [
              'Essential fundamentals',
              'Tool handling',
              'Guided first cuts',
              'Real barbering experience',
              'Feedback',
            ],
            ctaLabel: 'Reserve your spot',
          },
          {
            id: 'profesional',
            name: 'PROFESSIONAL XCLUSIVE PROGRAM',
            priceLabel: '$3,500 (early) / $4,000',
            billingLabel: 'AUD',
            hook: 'Become a professional barber in 12 weeks.',
            formatLabel: 'In-person - 12 weeks, 80% practical / 20% theory',
            description:
              'Complete training to take you from zero to professional. You learn real advanced techniques, work with real clients, and build a skill that can change your life. Our course is module-based, with around 100 hours of hands-on practice.',
            benefits: [
              'Barbershop hygiene, fades, scissor work, beards, and modern styles',
              'Practice with real clients',
              'Professional kit + uniform',
              'Private certificate',
            ],
            ctaLabel: 'Apply now',
          },
          {
            id: 'elite',
            name: 'ELITE MENTORING',
            priceLabel: '$400 - $1,500',
            billingLabel: 'AUD',
            hook: 'Train directly with me and take your career to the next level.',
            formatLabel: '1-on-1 in-person',
            description:
              'A personalized program for barbers who want to improve fast, fix mistakes, and position themselves as high-level professionals.',
            benefits: [
              'Personalized assessment',
              'Real-time technique correction',
              'Improvement plan',
              'Professional strategy',
            ],
            ctaLabel: 'Apply for mentoring',
          },
          {
            id: 'business',
            name: 'BARBER BUSINESS EXPERIENCE',
            priceLabel: '$400 - $700',
            billingLabel: 'AUD',
            hook:
              'Learn how to make money in the barbering industry, not just from cutting hair.',
            formatLabel: 'In-person workshop',
            description:
              'Discover how to attract clients, charge more, and grow as a barber in the real world: barber marketing and how to position yourself as a go-to name.',
            benefits: [
              'Strategies to attract clients',
              'How to raise your prices',
              'Personal brand',
              'Real business experience',
            ],
            ctaLabel: 'Reserve your spot',
          },
        ],
        instagramAlt: 'Instagram',
        logoAlt: 'Xclusive Barber Academy',
        whatsappAlt: 'WhatsApp',
      },
      flowGate: {
        unlockTitle: 'Unlock full content',
        unlockDescription: 'Share your email and phone to see all the details.',
        submitLabel: 'GET MORE INFORMATION',
      },
      phoneCapture: {
        pending: 'SENDING...',
        countryCodeLabel: 'Country code',
        emailLabel: 'Email',
        emailPlaceholder: 'YOUR EMAIL',
        phoneLabel: 'Phone',
        phonePlaceholder: 'YOUR PHONE',
        success:
          'Thank you. We received your contact information. You can continue exploring our courses.',
        helper: 'We need your email and phone to continue.',
        defaultSubmit: 'GET MORE INFORMATION',
      },
      premiumCapture: {
        quickContact: 'Quick contact',
        heading: 'Leave your phone and get guidance to choose the ideal course.',
      },
    },
    actions: {
      apply: {
        invalidEmail: 'Invalid email address.',
        invalidPassword: 'Password must be at least 6 characters.',
        invalidName: 'Invalid name.',
        nameTooLong: 'Name is too long.',
        invalidInviteCode: 'Invalid access code.',
        invalidForm: 'Invalid form data.',
        inviteExpired: 'Invalid or expired access code.',
        activationError: 'Failed to activate your account. Please try again.',
        rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
      },
      login: {
        invalidCredentials: 'Invalid credentials',
      },
      landing: {
        invalidEmail: 'Invalid email address.',
        phoneRequired: 'Enter a valid phone number.',
        invalidPhone: 'Invalid phone number.',
        invalidCountryCode: 'Invalid country code.',
        invalidData: 'Invalid data.',
        phoneWithCountryCode: 'Enter a valid phone number with country code.',
        registerFailed: 'We could not save your contact. Please try again.',
        migrationMissing:
          'We could not save your contact because the pre-lead database flow is not enabled yet. Run migration 2026-04-01-prelead-phone-capture.sql.',
        duplicatePhone:
          'This phone number is already registered. Use another phone number to continue.',
        duplicateEmail: 'This email address is already registered. Use another email to continue.',
        rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
      },
      qualifyPublic: {
        missingTrackedPhone:
          'Please submit your phone number on the landing page before starting this process.',
        invalidForm: 'Invalid form.',
        rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
        qualificationSaveError: 'We could not save your qualification. Please try again.',
        answersPartialError:
          'Part of your information was saved, but there was an error saving your answers.',
        defaultWhatsappMessage: 'I am interested in joining the academy and I want to enroll now.',
        selectedPlanMessage:
          'Hi Xclusive team, I just completed the form and I am interested in the {{plan}} plan. I want to move forward with my enrollment.',
        planLabels: {
          starter: 'BARBER STARTER EXPERIENCE',
          profesional: 'PROFESSIONAL XCLUSIVE PROGRAM',
          elite: 'ELITE MENTORING',
          business: 'BARBER BUSINESS EXPERIENCE',
        },
      },
      qualifyDashboard: {
        mustLogin: 'You must sign in to complete this step.',
        profileMissing: 'We could not find your profile.',
        invalidForm: 'Invalid form.',
        invalidEmail: 'Your account does not have a valid email.',
        qualificationSaveError: 'We could not save your qualification. Please try again.',
        answersPartialError:
          'Part of your information was saved, but there was an error saving your answers.',
      },
      tracker: {
        descriptionMin: 'Description must be at least 10 characters.',
        descriptionMax: 'Description cannot exceed 1000 characters.',
        imageRequired: 'Image is required.',
        fileTooLarge: 'The file exceeds the {{sizeMb}} MB limit.',
        invalidMimeType: 'File type not allowed: {{mimeType}}. Only images are accepted.',
        invalidExtension: 'File extension not allowed: .{{extension}}. Only images are accepted.',
        invalidForm: 'Invalid form data.',
        uploadStorageError: 'Error uploading image to Storage.',
        saveDbError: 'Could not save practice. Please try again.',
        unauthenticated: 'Unauthenticated user.',
        notFoundOrForbidden: 'Practice not found or you do not have permission to delete it.',
        deleteFailed: 'Could not delete the practice.',
      },
      grading: {
        unauthenticated: 'You are not authenticated.',
        instructorOnly: 'You do not have instructor permissions for this action.',
        submissionMissing: 'Submission not found or you do not have permission to view it.',
        manualPending: 'Manual feedback pending.',
        aiError: 'Automatic feedback could not be generated.',
        unexpectedError: 'An unexpected server error occurred.',
        saveFailed: 'Failed to save grade. Please try again.',
      },
      adminCourses: {
        createModuleError: 'Failed to create module.',
        reorderInvalidData: 'Invalid data to reorder lessons.',
        reorderDuplicate: 'There are duplicate lessons in the new order.',
        reorderMismatch: 'The received order does not match the selected module.',
      },
      adminUsers: {
        invalidLeadPhone: 'Invalid lead phone number.',
        leadPhoneNotFound: 'No lead phone was found for that number.',
        unauthorizedUser: 'Unauthorized: you must sign in.',
        unauthorizedAdmin: 'Unauthorized: administrators only.',
      },
      crmScoring: {
        readyToInvest: 'Ready to invest in their training',
        startImmediately: 'Looking to start immediately',
        callAvailable: 'Available for an admissions call',
        ownBusinessGoal: 'Goal is to open their own business',
      },
      openai: {
        fallbackShort: 'Keep practicing, great effort.',
        fallbackDetailed:
          'Great effort. Review symmetry and cleanliness details for your next submission.',
      },
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Language]

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language]
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
  }, template)
}
