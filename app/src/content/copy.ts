// Todos los textos de la interfaz, en un solo lugar (español rioplatense, voseo).
// Para el cambio en vivo: buscá la frase en este archivo y cambiala. No hay textos sueltos en los componentes,
// salvo las recomendaciones (src/domain/recommendations.ts) y los nombres de las áreas, que están acá abajo.
import type { AreaId, BillingSetup, BusinessType, LeadTier, LocalsBand, SalesChannel } from '../domain/types'
import type { LeadReason } from '../domain/leadTier'
import type { Grade } from '../domain/scoring'

export const copy = {
  brand: { name: 'Diagnóstico gratis', demoTag: 'demo' },

  nav: { blog: 'Guías', debug: 'Panel de eventos' },

  hero: {
    eyebrow: 'Diagnóstico gratis',
    title: '¿Cómo está tu restaurante online?',
    subtitle:
      'Revisamos tu ficha de Google, tus reseñas, tu web y tus apps de delivery en 60 segundos. Sin tarjeta y sin registro.',
    searchLabel: 'Nombre de tu local',
    searchPlaceholder: 'Ej.: Pizzería Piki, Lanús',
    searchButton: 'Diagnosticar',
    searching: 'Buscando…',
    examplesLabel: 'O probá con un local real de la demo:',
    examples: ['Piki', 'El Campeón', "Red's Burger", 'Davvero', 'Ladina', 'Diavola'],
    tooShort: 'Escribí al menos 2 letras.',
    searchError: 'No pudimos buscar ahora. Probá de nuevo en un rato.',
    trust: [
      'Usa datos públicos de tu local',
      'Sin tarjeta ni registro',
      'La nota sale de reglas que podés ver',
    ],
  },

  notFound: {
    title: (query: string) => `No encontramos “${query}” en la demo`,
    body: 'En la demo cubrimos estos locales reales. En producción, la búsqueda usa Google Places y encuentra cualquier local.',
    pick: 'Tocá uno para probar:',
  },

  confirm: {
    titleOne: '¿Es este tu local?',
    titleMany: '¿Cuál es tu local?',
    yes: 'Sí, es este',
    pick: 'Elegir este',
    back: 'Buscar de nuevo',
    noRating: 'Sin reseñas que podamos leer',
    reviews: (n: number) => `${n.toLocaleString('es-AR')} reseñas`,
  },

  questions: {
    progress: (n: number, total: number) => `Pregunta ${n} de ${total}`,
    next: 'Siguiente',
    back: 'Volver',
    seeResult: 'Ver mi diagnóstico',
    pickOne: 'Elegí una opción',
    pickAtLeastOne: 'Elegí al menos una',
    items: {
      businessType: {
        title: '¿Qué tipo de negocio es?',
        options: {
          restaurante: 'Restaurante',
          bar: 'Bar',
          pizzeria: 'Pizzería',
          cafeteria: 'Cafetería',
          'dark-kitchen': 'Dark kitchen (solo delivery)',
          'por-abrir': 'Todavía no abrí',
          otro: 'Otro (kiosco, catering, food truck…)',
        } satisfies Record<BusinessType, string>,
      },
      channels: {
        title: '¿Por dónde vendés hoy?',
        hint: 'Podés marcar varias.',
        options: {
          salon: 'En el salón',
          mostrador: 'Mostrador / retiro',
          apps: 'Apps de delivery',
          'delivery-propio': 'Delivery propio (WhatsApp, web)',
        } satisfies Record<SalesChannel, string>,
      },
      billing: {
        title: '¿Cómo cobrás y facturás hoy?',
        options: {
          manual: 'A mano: papel, Excel o calculadora',
          terminal: 'Solo con la terminal de tarjetas',
          'otro-sistema': 'Con otro sistema de gestión',
        } satisfies Record<BillingSetup, string>,
      },
      locals: {
        title: '¿Cuántos locales tenés?',
        options: { '1': '1 local', '2-3': '2 o 3 locales', '4+': '4 o más' } satisfies Record<
          LocalsBand,
          string
        >,
      },
    },
  },

  loading: { title: 'Armando tu diagnóstico…', error: 'No pudimos armar el diagnóstico. Probá de nuevo.' },

  result: {
    eyebrow: 'Tu diagnóstico',
    overall: 'Nota general',
    outOf: 'de 100',
    noScore: 'Sin datos suficientes',
    notApplicable: 'No aplica: no vendés por delivery',
    insufficient: 'Sin datos suficientes',
    partial: (known: number, total: number) => `Basada en ${known} de ${total} chequeos: el resto no lo pudimos leer`,
    areasTitle: 'Nota por área',
    detail: 'Ver el detalle',
    countryAssumed:
      'La dirección de este local no es de los 5 países de la demo: usamos Argentina como referencia.',
    brBanner:
      'Contenido en español: la versión en portugués está fuera del alcance de la demo.',
    recsTitle: 'Qué mejorar primero',
    recsIntro: 'Ordenadas por impacto. Cada una te lleva a la herramienta o al módulo que lo resuelve.',
    actionKind: {
      'free-tool': 'Herramienta gratis',
      'paid-module': 'Módulo de pago',
      guide: 'Guía gratis',
    },
    guidesLink: (country: string) => `Guías para restaurantes de ${country}`,
    whyRoute: 'Por qué te mostramos esto',
    restart: 'Diagnosticar otro local',
  },

  grade: {
    great: 'Muy bien',
    good: 'Bien, con margen',
    fair: 'A mejorar',
    poor: 'Urgente',
  } satisfies Record<Grade, string>,

  areas: {
    google: { name: 'Google', help: 'Ficha completa: horarios, dirección, categoría y precios' },
    reviews: { name: 'Reseñas', help: 'Rating y cantidad de reseñas' },
    web: { name: 'Web y redes', help: 'Si tenés web propia e Instagram (solo presencia, no actividad)' },
    delivery: { name: 'Delivery', help: 'En cuántas apps estás y si tenés canal propio' },
    operation: { name: 'Operación', help: 'Cobro, facturación y orden entre canales y locales' },
  } satisfies Record<AreaId, { name: string; help: string }>,

  checks: {
    hours: 'Horarios',
    address: 'Dirección',
    category: 'Categoría',
    price: 'Nivel de precios',
    rating: 'Rating',
    volume: 'Cantidad de reseñas',
    website: 'Sitio web propio',
    instagram: 'Instagram',
    apps: 'Apps de delivery',
    ownChannel: 'Canal propio de delivery',
    billing: 'Cobro y facturación',
    channels: 'Orden entre canales',
    locals: 'Orden entre locales',
  } as Record<string, string>,

  checkStatus: {
    ok: 'Bien',
    warn: 'Mejorable',
    bad: 'Falta',
    unknown: 'No lo pudimos leer',
  },

  evidence: {
    absent: 'Verificado: no tiene',
    notFound: 'No lo pudimos leer',
    yourAnswer: 'tu respuesta',
    yes: 'Sí',
    no: 'No',
  },

  badge: {
    real: (date: string) => `real · capturado el ${date}`,
    live: 'en vivo',
    simulated: 'simulado',
    answer: 'tu respuesta',
  },

  money: {
    eyebrow: 'Estimación simulada',
    title: 'Cuánta plata se te escapa por mes',
    approx: 'Aproximadamente',
    range: (low: string, high: string) => `Rango razonable: entre ${low} y ${high}`,
    disclaimer:
      'Es una estimación simulada con supuestos propios de la demo, no un dato real de tu negocio.',
    how: '¿Cómo calculamos esto?',
    howIntro:
      'Es una cuenta simple, con números que podés discutir. Estos son los pasos y todos los supuestos:',
    steps: {
      sales: (orders: string, ticket: string, locals: string, sales: string) =>
        `Ventas por mes ≈ ${orders} pedidos × ${ticket} de ticket × ${locals} (locales) = ${sales}`,
      volumeNote: (volume: string) => `El volumen (${volume}) sale de la cantidad de reseñas de Google, un proxy gratis.`,
    },
    lines: {
      apps: {
        title: 'Comisión de apps que podrías recuperar',
        formula: 'ventas × % por apps × comisión × parte que pasaría a un canal propio',
      },
      google: {
        title: 'Ventas que no llegan por una ficha de Google incompleta',
        formula: 'ventas × 4% × (100 − tu nota de Google) / 100',
      },
      billing: {
        title: 'Merma por cobrar y facturar a mano',
        formula: 'ventas × % de merma según cómo cobrás hoy',
      },
    },
    assumptionsTitle: 'Supuestos (simulados, editables en el código)',
    assumptions: {
      appShare: 'Parte de tus pedidos que entra por apps (si vendés por apps)',
      appShareDarkKitchen: 'Idem, para dark kitchen',
      appCommission:
        'Comisión de las apps. En Argentina la prensa informa 25%–35% (iProfesional, 14/05/2026); en el resto es un supuesto',
      redirectableShare: 'Parte de esos pedidos que podrías pasar a un canal propio',
      googleGapLoss: 'Ventas perdidas con la ficha de Google al 0%',
      billingManual: 'Merma si cobrás a mano',
      billingTerminal: 'Merma si cobrás solo con terminal',
      ticket: 'Ticket promedio (supuesto de la demo)',
      orders: 'Pedidos por mes por local, según volumen (supuesto de la demo)',
    },
    zero: 'Con lo que nos contaste, no detectamos plata que se escape de forma clara.',
  },

  route: {
    reasons: {
      'por-abrir': 'Contaste que todavía no abriste.',
      'fuera-de-segmento': 'Tu rubro está fuera del segmento de esta herramienta.',
      cadena: 'Tenés 4 o más locales.',
      'nucleo-sin-sistema': 'Vendés con volumen y por delivery, y hoy no tenés un sistema que lo ordene.',
      'nucleo-con-sistema': 'Vendés con volumen y por delivery, y ya usás otro sistema.',
      'poco-volumen': 'Todavía tenés pocas reseñas, lo que indica poco volumen.',
      'sin-delivery': 'No vendés por delivery.',
    } satisfies Record<LeadReason, string>,

    caliente: {
      eyebrow: (product: string) => `Tu ${product} ya armado`,
      title: (product: string) => `Tu ${product} ya viene con tu local cargado`,
      intro:
        'Con los datos que ya tenemos de tu local, armamos cómo te quedaría la cuenta. Revisala y creala.',
      cta: (product: string) => `Crear mi cuenta de ${product}`,
    },
    switcher: {
      title: (product: string) => `Pasate a ${product} sin empezar de cero`,
      intro: 'Ya tenés un sistema, así que lo que importa es no perder lo que cargaste. Mirá cómo quedaría tu cuenta.',
      migrateTitle: 'Migramos tus datos',
      migrateBody:
        'Podés importar tus productos desde un Excel. En la demo no se importa nada: es una simulación.',
      migrateLink: 'Cómo importar productos desde Excel',
      migrateUrl: 'https://soporte.fu.do/es/articles/11730891-1-1-importar-productos-excel',
    },
    preview: {
      title: 'Así quedaría tu cuenta',
      name: 'Nombre del local',
      address: 'Dirección',
      hours: 'Horarios',
      hoursMissing: 'No pudimos leer tus horarios: los cargás en un minuto.',
      menu: 'Carta',
      menuNote: 'Ejemplo ilustrativo. En producción la carta se cargaría desde una foto o PDF con Carta QR.',
      plan: 'Plan sugerido',
      planFrom: (name: string, price: string) => `${name}, desde ${price} por mes`,
      planNote: 'Precio publicado en fu.do.',
      menuSample: [
        { name: 'Plato del día', price: 'ejemplo' },
        { name: 'Bebida', price: 'ejemplo' },
        { name: 'Postre', price: 'ejemplo' },
      ],
    },
    simulatedNotice: (site: string) =>
      `Hoy el alta de ${site} no acepta precarga de datos, así que este botón es una simulación. En producción pasaríamos tu nombre, dirección y horarios al alta.`,
    modal: {
      title: 'Simulación: crear tu cuenta',
      body: 'Esto es lo que se precargaría en la cuenta:',
      simulate: 'Simular la creación',
      cancel: 'Cerrar',
      doneTitle: 'Listo (simulado)',
      doneBody: 'No se creó ninguna cuenta. Para crear la cuenta real, seguí al alta oficial.',
      realLink: (product: string) => `Ir al alta real de ${product}`,
    },
    nutrir: {
      title: 'Todavía no es el momento de un sistema: empecemos por lo que más rinde',
      intro: 'Con lo que contaste, lo mejor es mejorar tu presencia antes de invertir en gestión. Estas guías gratis son para vos:',
      emailLabel: 'Tu email, por si querés recibir más guías',
      emailButton: 'Mandame las guías',
      emailDone: 'Listo (simulado): no se envió nada ni guardamos tu email. En producción llegaría el link de las guías.',
      emailInvalid: 'Escribí un email válido.',
    },
    porAbrir: {
      title: 'Todavía no abriste: te ayuda el Consultor de Nuevos Negocios',
      body: 'Antes de pensar en un sistema, conviene tener el plan: identidad, competidores, carta, compras y un plan de redes de 4 semanas, más la guía de trámites según tu ubicación. Es gratis, toma unos 2 minutos y no pide tarjeta.',
      cta: 'Probar el Consultor de Nuevos Negocios',
      url: 'https://tools.fu.do/abrir-un-restaurante',
    },
    descartar: {
      cadenaTitle: 'Con 4 o más locales conviene hablar con una persona',
      cadenaBody:
        'Las cadenas necesitan reportes consolidados y una puesta en marcha acompañada. Esta herramienta es para negocios de 1 a 3 locales.',
      cadenaCta: 'Hablar con ventas',
      otroTitle: 'Esta herramienta es para restaurantes, bares y cafeterías',
      otroBody:
        'Tu rubro queda fuera de lo que sabemos diagnosticar. Igual dejamos las guías por si te sirven.',
      guidesCta: 'Ver las guías',
    },
  },

  footer: {
    title: 'Qué es real y qué es simulado',
    disclaimer:
      'Demo de entrevista. Lo real lleva fuente y fecha; lo simulado está marcado como tal.',
    columns: { what: 'Qué', status: 'Estado', detail: 'Detalle' },
    rows: [
      {
        what: 'Datos del local (nombre, dirección, rating, reseñas, horarios, web, delivery)',
        status: 'real',
        detail:
          'Locales reales capturados el 26/10/2026 de la ficha pública de Google y de las apps. Solo para la demo: en producción se consultan en vivo a Google Places.',
      },
      {
        what: 'Precios de planes y links de Fudo',
        status: 'real',
        detail: 'Publicados en fu.do, capturados el 26/10/2026.',
      },
      {
        what: 'Notas por área y recomendaciones',
        status: 'real',
        detail: 'Cálculo por reglas sobre esos datos reales. No usa IA.',
      },
      {
        what: 'Cuánta plata se te escapa por mes',
        status: 'simulado',
        detail: 'Estimación con supuestos propios (ticket, pedidos, comisión) visibles en la pantalla.',
      },
      {
        what: 'Tu cuenta ya armada, la carta y la creación de cuenta',
        status: 'simulado',
        detail: 'Hoy el alta de fu.do no acepta precarga: el botón solo simula.',
      },
      {
        what: 'Envío de email y migración de datos',
        status: 'simulado',
        detail: 'No se envía ni se importa nada.',
      },
      {
        what: 'Instagram y apps de delivery',
        status: 'parcial',
        detail: 'Solo la presencia (que exista el perfil o el link). No hay métricas: no tenemos acceso real a ellas.',
      },
    ],
    status: { real: 'real', simulado: 'simulado', parcial: 'solo presencia' } as Record<string, string>,
    debug: 'Panel de eventos (/debug)',
  },

  debug: {
    title: 'Panel de eventos',
    intro: 'Los eventos se guardan en el localStorage de este navegador. No se envía nada a ningún servidor.',
    funnel: 'Embudo',
    funnelHint: 'Sesiones únicas que llegaron a cada paso',
    events: 'Eventos',
    empty: 'Todavía no hay eventos. Hacé un diagnóstico y volvé.',
    clear: 'Limpiar eventos',
    back: 'Volver al diagnóstico',
    cols: { time: 'Hora', session: 'Sesión', event: 'Evento', props: 'Datos' },
  },

  tiers: {
    caliente: 'Caliente',
    switcher: 'Switcher',
    nutrir: 'Nutrir',
    descartar: 'Descartar',
    'por-abrir': 'Por abrir',
  } satisfies Record<LeadTier, string>,
}

export const siteName = 'Diagnóstico gratis para restaurantes'
