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
      courses: 'Programas',
      getStarted: 'Comenzar',
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
    coursesPage: {
      heading: 'Programas de la Academia',
      subtitle:
        'Formación práctica en barbería dentro de una barbería real en Coburg, Melbourne.',
    },
    courseDetailPage: {
      backLink: '← Todos los programas',
    },
    landing: {
      hero: {
        subtitle: 'EDUCACION PROFESIONAL EN BARBERIA EN MELBOURNE',
        headingTop: 'FORMACION ORIENTADA A LOS ESTANDARES REALES DEL',
        headingBottom: 'MERCADO AUSTRALIANO',
        paragraph:
          'Sistema de aprendizaje practico y estructurado para construir una carrera real, con estandares profesionales y mentalidad de negocio.',
        seoHeading:
          'Academia de barbería en Melbourne: formación práctica en una barbería real en Coburg',
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
        backgroundAlt:
          'Interior de Xclusive Barber Coburg, una barbería real: techo hexagonal de luces LED, pared de ladrillo verde y sillones de barbero',
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
              'Primeros cortes guiados',
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
              'Higiene de la barbería, fades, tijera, barba y estilos modernos',
              'Practica con clientes reales',
              'Kit profesional + uniforme',
              'Certificado de finalización de Xclusive Academy',
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
        createLessonError: 'No se pudo crear la lección.',
        updateModuleTitleError: 'No se pudo actualizar el módulo.',
        updateLessonTitleError: 'No se pudo actualizar la lección.',
        updateModuleCompetencyError: 'No se pudo actualizar la competencia.',
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

    // ─── Dashboard (UI chrome) ──────────────────────────────────────────────
    dashboard: {
      hub: {
        trainingProgram: {
          title: 'Programa de Formación',
          description:
            'Completa los módulos teóricos y prácticos del programa de barbería, paso a paso.',
        },
        tracking: {
          title: 'Seguimiento y Evaluación',
          description:
            'Envía tus prácticas y recibe evaluación y feedback de tus instructores.',
        },
        progress: {
          title: 'Progreso Profesional',
          description:
            'Revisa tu dominio de las cuatro competencias centrales de la profesión.',
        },
        academy: {
          title: 'La Academia',
          description:
            'Descubre Xclusive Barber Academy, sus valores y la comunidad detrás del proyecto.',
        },
        adminPanel: 'Panel de Gestión',
      },
      coursesList: {
        heading: 'PROGRAMA DE FORMACIÓN',
        subtitle: 'Avanza a través de los módulos de tu formación profesional.',
        module: 'MÓDULO {{n}}',
        status: 'ESTADO:',
        inProgress: 'En progreso',
        locked: 'Bloqueado',
        empty: 'No hay módulos disponibles aún.',
        descriptionFallback: 'Contenido esencial para tu formación.',
        cta: 'PONER EN PRÁCTICA MI FORMACIÓN',
      },
      lesson: {
        lessons: 'LECCIONES',
        module: 'MÓDULO {{n}}',
        microOptional: 'Micro texto Opcional',
        audiovisualUnit: 'Unidad Audiovisual',
        noDescription: 'Sin descripción disponible.',
        visualReferences: 'Referencias Visuales',
        nextLesson: 'SIGUIENTE LECCIÓN',
        previousLesson: 'LECCIÓN ANTERIOR',
        endOfModule: 'Fin del módulo',
        back: 'Volver',
        sidebar: {
          backToCourses: 'Volver a Cursos',
          moduleContent: 'Contenido del Módulo',
          yourProgress: 'Tu progreso',
          loading: 'Cargando...',
        },
        video: {
          invalidUrl: 'URL de video no válida',
          unavailable: 'Video no disponible',
          completed: '✓ Lección Completada',
        },
      },
      progress: {
        statuses: {
          completed: 'Completado',
          competent: 'Competente',
          inProgress: 'En Progreso',
          notStarted: 'Sin Iniciar',
        },
        nextLevel: 'PRÓXIMO NIVEL',
        requires: 'REQUIERE',
        remaining: 'FALTAN',
        nextLevelLabel: 'PRÓXIMO NIVEL:',
        requiresModules: 'REQUIERE: {{required}} DE {{total}} MÓDULOS COMPLETADOS',
        missingModules: 'FALTAN: {{remaining}} {{moduleWord}}',
        moduleWordSingular: 'MÓDULO',
        moduleWordPlural: 'MÓDULOS',
        student: 'Estudiante',
        email: 'Correo',
        startDate: 'Fecha de Inicio',
        currentStatus: 'Estado Actual',
        studentActive: 'Activo',
        backToDashboard: 'Volver al Dashboard',
        heroTitle: 'PROGRESO\nPROFESIONAL',
        photoAlt: 'Foto del estudiante',
        avanceAlt: 'Avance Profesional',
        heroSubtitle:
          'Seguimiento de tu desarrollo dentro del programa formativo.',
        competencyDevelopment: 'DESARROLLO DE\nCOMPETENCIAS',
        metricGeneral: 'Progreso\nGeneral',
        metricModules: 'Módulos\nCompletados',
        metricPractices: 'Prácticas\nEnviadas',
        of: 'DE',
        ctaTitle: '¡ESTÁS AVANZANDO CON CONSISTENCIA!',
        ctaBodyLine1: 'Mantén el ritmo para alcanzar',
        ctaBodyLine2: 'tu máximo potencial.',
        ctaButton: '¡SIGUE APRENDIENDO!',
      },
      competencyLabels: {
        desarrollo_tecnico: 'Desarrollo Técnico',
        aplicacion_estandares: 'Aplicación de Estándares',
        atencion_cliente: 'Atención al Cliente',
        mentalidad_profesional: 'Mentalidad Profesional',
      },
      professionalLevels: {
        talento: { label: 'Talento en Formación', subtitle: 'Comenzando el camino' },
        tecnico: { label: 'Técnico en Desarrollo', subtitle: 'Construyendo habilidades' },
        avanzado: { label: 'Barbero Avanzado', subtitle: 'Dominando el oficio' },
        profesional: { label: 'Profesional Xclusive', subtitle: 'Excelencia alcanzada' },
      },
      header: {
        tagline: 'Tu proceso de formación comienza aquí',
        title: 'Área Académica',
        description:
          'Espacio oficial de formación y seguimiento profesional dentro de la academia.',
      },
      footer: {
        defaultTagline: 'Plataforma oficial de desarrollo académico.',
        instagramAria: 'Abrir Instagram de Xclusive Barber Academy',
        whatsappAria: 'Abrir chat de WhatsApp con el equipo de Xclusive',
        whatsappMessage:
          'Hola equipo de Xclusive Barber Academy, vengo desde la plataforma y quiero recibir ayuda.',
      },
      coursesIndex: {
        headerTitle: 'Módulos',
        bannerSubtitle: 'FORMACIÓN PROFESIONAL EN BARBERÍA',
      },
      adminMenu: {
        panel: 'Panel de Gestión',
        roleBadgeAdmin: 'Admin',
        roleBadgeInstructor: 'Instructor',
        gradeStudents: {
          title: 'Evaluar Estudiantes',
          description:
            'Revisar entregas, calificar cortes y proporcionar retroalimentación técnica.',
        },
        manageCourses: {
          title: 'Gestión de Cursos',
          description:
            'Administrar catálogo, editar lecciones y configurar módulos de aprendizaje.',
        },
        manageUsers: {
          title: 'Gestión de Usuarios',
          description:
            'Crear codigos de acceso de un solo uso y administrar roles de usuarios.',
        },
        manageLeads: {
          title: 'Gestión de Leads',
          description:
            'Revisar score automatico, gestionar etapas CRM y dar seguimiento comercial.',
        },
      },
      tracker: {
        headerTitle: 'Evolución Profesional',
        backAria: 'Volver',
        backAlt: 'Volver',
        bannerSubtitle: 'Formación Profesional en Barbería',
        title: 'SEGUIMIENTO Y EVALUACIÓN',
        description:
          'Revisa observaciones, evaluaciones y retroalimentación profesional sobre tu desempeño y evolución dentro del programa.',
        subtitle:
          'ENVÍA TU PRÁCTICA, RECIBE EVALUACIÓN PROFESIONAL Y ELEVA TU ESTÁNDAR TÉCNICO',
        sectionTitle: 'PRÁCTICAS ENVIADAS',
        sectionSubtitle: 'Seguimiento de envíos y estado de revisión.',
        empty: 'No hay prácticas registradas',
        form: {
          title: 'ENTREGA DE EVIDENCIA',
          subtitle: 'REGISTRO VISUAL',
          uploadAlt: 'Subir corte',
          newCut: 'NUEVO CORTE',
          uploadButton: 'Subir archivo',
          selectCut: 'Selecciona Tipo de Corte',
          techniqueHeader: 'TÉCNICA IMPLEMENTADA',
          notesHeader: 'NOTAS TÉCNICAS',
          notesPlaceholder:
            'Describe brevemente el proceso realizado, herramientas utilizadas y consideraciones profesionales aplicadas...',
          submitting: 'ENVIANDO...',
          submit: 'PRESENTAR PARA EVALUACIÓN',
          errorEmptyFile: 'El archivo está vacío',
          errorTooLarge: 'El archivo supera el límite de {{sizeMb}} MB',
          errorMime:
            'Tipo de archivo no permitido ({{mimeType}}). Solo imágenes.',
          errorExtension:
            'Extensión no permitida (.{{ext}}). Solo imágenes.',
          errorUpload: 'Error al subir la práctica',
          cutTypes: {
            lowFade: 'Low Fade',
            midFade: 'Mid Fade',
            highFade: 'High Fade',
            taperFade: 'Taper Fade',
            buzzCut: 'Buzz Cut',
            scissorCut: 'Corte a Tijera',
          },
        },
        card: {
          practice: 'PRÁCTICA {{n}}',
          techniqueImplemented: 'TÉCNICA IMPLEMENTADA',
          noPhoto: 'Sin foto',
          feedback: 'RETROALIMENTACIÓN',
          inReview: 'EN PROCESO DE REVISIÓN',
          deleteAria: 'Eliminar práctica',
          photoAlt: 'Práctica {{n}} – {{cutType}}',
        },
        feedbackModal: {
          heading: 'PROFE JULIÁN',
          noFeedback: 'Sin retroalimentación disponible.',
          scores: 'PUNTUACIONES',
          fade: 'Fade / Desvanecido',
          cleanliness: 'Limpieza',
          technique: 'Técnica',
          symmetry: 'Simetría',
        },
      },
      grading: {
        headerTitle: 'Evaluación',
        restrictedTitle: 'Acceso Restringido',
        restrictedBody:
          'Esta zona está reservada exclusivamente para instructores y personal administrativo.',
        backToDashboard: 'Volver al Dashboard',
        instructorPanel: 'Panel de Instructor',
        pageTitle: 'Evaluación de Prácticas',
        pageDescription:
          'Revisa, califica y guía a los estudiantes hacia la perfección técnica.',
        pendingLabel: 'Pendientes:',
        emptyTitle: '¡Todo al día!',
        emptyBody:
          'No hay tareas pendientes de revisión en este momento. Buen trabajo, instructor.',
        footerTagline: 'Panel de evaluación — Xclusive Barber Academy.',
        photoAlt: 'Corte del estudiante',
        studentBadge: 'Estudiante',
        noDescription: 'Sin descripción proporcionada.',
        technicalEvaluation: 'Evaluación Técnica',
        scale: 'Escala 1-10',
        criteria: {
          fade: 'Fade',
          cleanliness: 'Limpieza',
          technique: 'Técnica',
          symmetry: 'Simetría',
        },
        saving: 'GUARDANDO...',
        save: 'CALIFICAR ENTREGA',
        errorSaving: 'Error al calificar',
      },
      admin: {
        headerTitle: 'Administración',
        panelLabel: 'Panel de Administración',
        courseManagement: 'Gestión del Curso',
        courseManagementDescription:
          'Estructura el contenido de la academia. Crea módulos, organiza lecciones y mantén el plan de estudios actualizado.',
        createModule: 'CREAR MÓDULO',
        moduleNumber: 'Módulo 0{{n}}',
        lessonsCount: '{{n}} lecciones',
        noCompetency: 'Sin competencia',
        lessonNumber: 'Lección 0{{n}}',
        edit: 'Editar',
        deleteModuleTitle: 'Eliminar Módulo',
        deleteLessonTitle: 'Borrar Lección',
        addLesson: 'Agregar lección',
        emptyModule: 'Este módulo está vacío.',
        emptyCourse: 'Curso vacío',
        emptyCourseBody:
          'Aún no has creado ningún módulo. Comienza tu plan de estudios ahora.',
        renameTitle: 'Renombrar',
        titleEnPlaceholder: 'Título EN',
        loadError: 'Error cargando el curso. Revisa la consola del servidor.',
        prompts: {
          newModule: 'Nombre del nuevo Módulo (Ej: Corte Clásico):',
          deleteModuleConfirm:
            '¿Estás seguro de borrar este módulo y todas sus lecciones?',
          newLesson: 'Título de la Lección:',
          deleteLessonConfirm: '¿Borrar esta lección permanentemente?',
          newModuleEn: 'Título del Módulo en inglés (opcional):',
          newLessonEn: 'Título de la Lección en inglés (opcional):',
        },
        editLesson: {
          editorMode: 'Modo Editor',
          saving: 'GUARDANDO...',
          save: 'GUARDAR',
          saved: '¡Guardado correctamente!',
          writtenContent: 'Contenido Escrito',
          videoConfig: 'Configuración de Video',
          noVideo: 'Sin video asignado',
          youtubeLabel: 'Enlace de YouTube',
          youtubePlaceholder: 'https://youtube.com/watch?v=...',
          youtubeHelper:
            'Pega la URL completa del video. Se extraerá el ID automáticamente.',
          contentStatus: 'Estado del contenido:',
          active: 'Activo',
          titleEnSection: 'Traducción al inglés',
          titleEnHelper:
            'Título de la lección en inglés (opcional). El contenido HTML no se traduce.',
          errorTitle: 'Error: ',
        },
      },
      adminToolbar: {
        bold: 'Negrita',
        italic: 'Cursiva',
        h1: 'H1',
        h2: 'H2',
        list: 'Lista',
        listNumbered: 'Lista #',
        insertImage: 'Insertar Imagen',
        insertYoutube: 'Insertar Video YouTube',
        youtubePrompt: 'Ingresa la URL del video de YouTube:',
        youtubeInvalid: 'Por favor ingresa una URL válida de YouTube',
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
      courses: 'Programs',
      getStarted: 'Get Started',
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
    coursesPage: {
      heading: 'Academy Programs',
      subtitle:
        'Practical, hands-on barbering training inside a real, operating barbershop in Coburg, Melbourne.',
    },
    courseDetailPage: {
      backLink: '← All Programs',
    },
    landing: {
      hero: {
        subtitle: 'PROFESSIONAL BARBER EDUCATION IN MELBOURNE',
        headingTop: 'TRAINING ALIGNED WITH REAL STANDARDS OF THE',
        headingBottom: 'AUSTRALIAN MARKET',
        paragraph:
          'A practical and structured learning system to build a real career, with professional standards and business mindset.',
        seoHeading:
          'Barber academy in Melbourne: hands-on training inside a real barbershop in Coburg',
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
        backgroundAlt:
          'Inside Xclusive Barber Coburg, a real barbershop: hexagonal LED ceiling, green brick wall and barber chairs',
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
              'Xclusive Academy completion confirmation',
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
        createLessonError: 'Failed to create lesson.',
        updateModuleTitleError: 'Failed to update module.',
        updateLessonTitleError: 'Failed to update lesson.',
        updateModuleCompetencyError: 'Failed to update competency.',
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

    // ─── Dashboard (UI chrome) ──────────────────────────────────────────────
    dashboard: {
      hub: {
        trainingProgram: {
          title: 'Training Program',
          description:
            'Complete the theoretical and practical modules of the barbering program, step by step.',
        },
        tracking: {
          title: 'Tracking & Evaluation',
          description:
            'Submit your practices and receive evaluation and feedback from your instructors.',
        },
        progress: {
          title: 'Professional Progress',
          description:
            'Check your mastery of the four core competencies of the profession.',
        },
        academy: {
          title: 'The Academy',
          description:
            'Discover Xclusive Barber Academy, its values and the community behind the project.',
        },
        adminPanel: 'Management Panel',
      },
      coursesList: {
        heading: 'TRAINING PROGRAM',
        subtitle: 'Advance through the modules of your professional training.',
        module: 'MODULE {{n}}',
        status: 'STATUS:',
        inProgress: 'In progress',
        locked: 'Locked',
        empty: 'No modules available yet.',
        descriptionFallback: 'Essential content for your training.',
        cta: 'PUT MY TRAINING INTO PRACTICE',
      },
      lesson: {
        lessons: 'LESSONS',
        module: 'MODULE {{n}}',
        microOptional: 'Optional Microtext',
        audiovisualUnit: 'Audiovisual Unit',
        noDescription: 'No description available.',
        visualReferences: 'Visual References',
        nextLesson: 'NEXT LESSON',
        previousLesson: 'PREVIOUS LESSON',
        endOfModule: 'End of module',
        back: 'Back',
        sidebar: {
          backToCourses: 'Back to Courses',
          moduleContent: 'Module Content',
          yourProgress: 'Your progress',
          loading: 'Loading...',
        },
        video: {
          invalidUrl: 'Invalid video URL',
          unavailable: 'Video unavailable',
          completed: '✓ Lesson Completed',
        },
      },
      progress: {
        statuses: {
          completed: 'Completed',
          competent: 'Competent',
          inProgress: 'In Progress',
          notStarted: 'Not Started',
        },
        nextLevel: 'NEXT LEVEL',
        requires: 'REQUIRES',
        remaining: 'MISSING',
        nextLevelLabel: 'NEXT LEVEL:',
        requiresModules: 'REQUIRES: {{required}} OF {{total}} COMPLETED MODULES',
        missingModules: 'MISSING: {{remaining}} {{moduleWord}}',
        moduleWordSingular: 'MODULE',
        moduleWordPlural: 'MODULES',
        student: 'Student',
        email: 'Email',
        startDate: 'Start Date',
        currentStatus: 'Current Status',
        studentActive: 'Active',
        backToDashboard: 'Back to Dashboard',
        heroTitle: 'PROFESSIONAL\nPROGRESS',
        photoAlt: 'Student photo',
        avanceAlt: 'Professional Progress',
        heroSubtitle: 'Track your development within the training program.',
        competencyDevelopment: 'COMPETENCY\nDEVELOPMENT',
        metricGeneral: 'General\nProgress',
        metricModules: 'Modules\nCompleted',
        metricPractices: 'Practices\nSubmitted',
        of: 'OF',
        ctaTitle: 'KEEP IT UP WITH CONSISTENCY!',
        ctaBodyLine1: 'Keep the pace to reach',
        ctaBodyLine2: 'your full potential.',
        ctaButton: 'KEEP LEARNING!',
      },
      competencyLabels: {
        desarrollo_tecnico: 'Technical Development',
        aplicacion_estandares: 'Application of Standards',
        atencion_cliente: 'Customer Service',
        mentalidad_profesional: 'Professional Mindset',
      },
      professionalLevels: {
        talento: { label: 'Talent in Training', subtitle: 'Starting the journey' },
        tecnico: { label: 'Technician in Development', subtitle: 'Building skills' },
        avanzado: { label: 'Advanced Barber', subtitle: 'Mastering the craft' },
        profesional: { label: 'Xclusive Professional', subtitle: 'Excellence achieved' },
      },
      header: {
        tagline: 'Your training journey starts here',
        title: 'Academic Area',
        description:
          'Official space for training and professional tracking within the academy.',
      },
      footer: {
        defaultTagline: 'Official platform for academic development.',
        instagramAria: 'Open Xclusive Barber Academy Instagram',
        whatsappAria: 'Open WhatsApp chat with the Xclusive team',
        whatsappMessage:
          'Hi Xclusive Barber Academy team, I am reaching out from the platform and I would like some help.',
      },
      coursesIndex: {
        headerTitle: 'Modules',
        bannerSubtitle: 'PROFESSIONAL BARBER TRAINING',
      },
      adminMenu: {
        panel: 'Management Panel',
        roleBadgeAdmin: 'Admin',
        roleBadgeInstructor: 'Instructor',
        gradeStudents: {
          title: 'Grade Students',
          description:
            'Review submissions, grade cuts, and provide technical feedback.',
        },
        manageCourses: {
          title: 'Course Management',
          description:
            'Manage the catalog, edit lessons, and configure learning modules.',
        },
        manageUsers: {
          title: 'User Management',
          description:
            'Create single-use access codes and manage user roles.',
        },
        manageLeads: {
          title: 'Leads Management',
          description:
            'Review auto scoring, manage CRM stages, and follow up on leads.',
        },
      },
      tracker: {
        headerTitle: 'Professional Evolution',
        backAria: 'Back',
        backAlt: 'Back',
        bannerSubtitle: 'Professional Barber Training',
        title: 'TRACKING & EVALUATION',
        description:
          'Review observations, evaluations, and professional feedback about your performance and progress in the program.',
        subtitle:
          'SUBMIT YOUR PRACTICE, RECEIVE PROFESSIONAL EVALUATION AND RAISE YOUR TECHNICAL STANDARD',
        sectionTitle: 'SUBMITTED PRACTICES',
        sectionSubtitle: 'Submission tracking and review status.',
        empty: 'No practices recorded',
        form: {
          title: 'EVIDENCE SUBMISSION',
          subtitle: 'VISUAL RECORD',
          uploadAlt: 'Upload cut',
          newCut: 'NEW CUT',
          uploadButton: 'Upload file',
          selectCut: 'Select Cut Type',
          techniqueHeader: 'TECHNIQUE IMPLEMENTED',
          notesHeader: 'TECHNICAL NOTES',
          notesPlaceholder:
            'Briefly describe the process performed, tools used, and professional considerations applied...',
          submitting: 'SUBMITTING...',
          submit: 'SUBMIT FOR EVALUATION',
          errorEmptyFile: 'The file is empty',
          errorTooLarge: 'The file exceeds the {{sizeMb}} MB limit',
          errorMime: 'File type not allowed ({{mimeType}}). Images only.',
          errorExtension: 'Extension not allowed (.{{ext}}). Images only.',
          errorUpload: 'Error uploading the practice',
          cutTypes: {
            lowFade: 'Low Fade',
            midFade: 'Mid Fade',
            highFade: 'High Fade',
            taperFade: 'Taper Fade',
            buzzCut: 'Buzz Cut',
            scissorCut: 'Scissor Cut',
          },
        },
        card: {
          practice: 'PRACTICE {{n}}',
          techniqueImplemented: 'TECHNIQUE IMPLEMENTED',
          noPhoto: 'No photo',
          feedback: 'FEEDBACK',
          inReview: 'IN REVIEW PROCESS',
          deleteAria: 'Delete practice',
          photoAlt: 'Practice {{n}} – {{cutType}}',
        },
        feedbackModal: {
          heading: 'PROF. JULIAN',
          noFeedback: 'No feedback available.',
          scores: 'SCORES',
          fade: 'Fade',
          cleanliness: 'Cleanliness',
          technique: 'Technique',
          symmetry: 'Symmetry',
        },
      },
      grading: {
        headerTitle: 'Evaluation',
        restrictedTitle: 'Restricted Access',
        restrictedBody:
          'This area is reserved exclusively for instructors and administrative staff.',
        backToDashboard: 'Back to Dashboard',
        instructorPanel: 'Instructor Panel',
        pageTitle: 'Practice Evaluation',
        pageDescription:
          'Review, grade, and guide students toward technical excellence.',
        pendingLabel: 'Pending:',
        emptyTitle: 'All caught up!',
        emptyBody:
          'No pending submissions to review right now. Good work, instructor.',
        footerTagline: 'Evaluation panel — Xclusive Barber Academy.',
        photoAlt: 'Student cut',
        studentBadge: 'Student',
        noDescription: 'No description provided.',
        technicalEvaluation: 'Technical Evaluation',
        scale: 'Scale 1-10',
        criteria: {
          fade: 'Fade',
          cleanliness: 'Cleanliness',
          technique: 'Technique',
          symmetry: 'Symmetry',
        },
        saving: 'SAVING...',
        save: 'GRADE SUBMISSION',
        errorSaving: 'Error while grading',
      },
      admin: {
        headerTitle: 'Administration',
        panelLabel: 'Administration Panel',
        courseManagement: 'Course Management',
        courseManagementDescription:
          'Structure the academy content. Create modules, organize lessons, and keep the curriculum up to date.',
        createModule: 'CREATE MODULE',
        moduleNumber: 'Module 0{{n}}',
        lessonsCount: '{{n}} lessons',
        noCompetency: 'No competency',
        lessonNumber: 'Lesson 0{{n}}',
        edit: 'Edit',
        deleteModuleTitle: 'Delete Module',
        deleteLessonTitle: 'Delete Lesson',
        addLesson: 'Add lesson',
        emptyModule: 'This module is empty.',
        emptyCourse: 'Empty course',
        emptyCourseBody:
          'You have not created any modules yet. Start your curriculum now.',
        renameTitle: 'Rename',
        titleEnPlaceholder: 'EN title',
        loadError: 'Error loading course. Check the server console.',
        prompts: {
          newModule: 'New Module name (e.g.: Classic Cut):',
          deleteModuleConfirm:
            'Are you sure you want to delete this module and all its lessons?',
          newLesson: 'Lesson Title:',
          deleteLessonConfirm: 'Delete this lesson permanently?',
          newModuleEn: 'Module English title (optional):',
          newLessonEn: 'Lesson English title (optional):',
        },
        editLesson: {
          editorMode: 'Editor Mode',
          saving: 'SAVING...',
          save: 'SAVE',
          saved: 'Saved successfully!',
          writtenContent: 'Written Content',
          videoConfig: 'Video Settings',
          noVideo: 'No video assigned',
          youtubeLabel: 'YouTube Link',
          youtubePlaceholder: 'https://youtube.com/watch?v=...',
          youtubeHelper:
            'Paste the full video URL. The ID will be extracted automatically.',
          contentStatus: 'Content status:',
          active: 'Active',
          titleEnSection: 'English translation',
          titleEnHelper:
            'Lesson English title (optional). Rich HTML content is not translated.',
          errorTitle: 'Error: ',
        },
      },
      adminToolbar: {
        bold: 'Bold',
        italic: 'Italic',
        h1: 'H1',
        h2: 'H2',
        list: 'List',
        listNumbered: 'List #',
        insertImage: 'Insert Image',
        insertYoutube: 'Insert YouTube Video',
        youtubePrompt: 'Enter the YouTube video URL:',
        youtubeInvalid: 'Please enter a valid YouTube URL',
      },
    },
  },
} as const

/**
 * REQ-INT-001 — Contrato del Diccionario tipado.
 *
 * Convierte recursivamente las hojas del literal `es` a `string`, preservando
 * la estructura exacta con claves `readonly`. `DictionaryShape` es la ÚNICA
 * forma del diccionario: ambas ramas deben satisfacerla, por lo que TypeScript
 * obliga a que `es` y `en` tengan exactamente las mismas claves (sin drift).
 *
 * Quitar una clave de una sola rama produce un error de compilación bajo
 * `_dictionaryParity` (REQ-INT-001) — verificación en verificación 'Analysis'
 * de la SRS.
 */
type ToString<T> = T extends readonly (infer U)[]
  ? readonly ToString<U>[]
  : T extends Record<string, unknown>
    ? { readonly [K in keyof T]: ToString<T[K]> }
    : string

export type DictionaryShape = ToString<typeof dictionaries.es>

export type Dictionary = DictionaryShape

// Paridad es/en: fuerza que la rama `en` (y la `es`) compartan la MISMA forma.
// Si `en` gana o pierde una clave respecto a `es`, el literal deja de satisfacer
// `DictionaryShape` y el compilador falla.
const _dictionaryParity: Record<Language, DictionaryShape> = dictionaries

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
