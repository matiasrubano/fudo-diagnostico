// Todos los textos de la interfaz, en un solo lugar.
//
//  1) `copy`  → textos que no cambian por país (marca, navegación, pantallas previas a saber el país, pie).
//  2) `voice` → textos con voz y nombres locales: un objeto BASE (voseo rioplatense, Argentina)
//     + OVERRIDES por país (tuteo para México, Chile y Colombia). Se usa desde que sabemos el país
//     del local: preguntas, ticket, vecinos, recomendaciones y ruteo. Las landings /ar/, /mx/, /cl/, /co/ también.
//     Para el cambio en vivo: buscá la frase en este archivo y cambiala. Para sumar una voz distinta
//     en un país, agregá la clave en `OVERRIDES.<PAÍS>` (lo que no pises se hereda del base).
//
//  Los nombres de apps, ente fiscal y moneda NO se escriben acá: llegan de src/config/countries.json.
//
// IMPORTANTE: este archivo lo importa también el servidor (src/domain/recommendations.ts), por eso sus
// imports son `import type ... from '....js'` (se borran al compilar) y no tiene dependencias de React.
import type { LeadReason } from '../domain/leadTier.js'
import type { Grade } from '../domain/scoring.js'
import type {
  AreaId,
  BillingSetup,
  BusinessType,
  CountryCode,
  LeadTier,
  LocalsBand,
  SalesChannel,
} from '../domain/types.js'

// ═══════════════════════════════════════════════════════════════════════════
//  1) TEXTOS COMUNES
// ═══════════════════════════════════════════════════════════════════════════

export const copy = {
  brand: { name: 'Diagnóstico gratis', demoTag: 'demo · no oficial', logoAlt: 'Fudo' },

  nav: { blog: 'Guías', debug: 'Panel de eventos' },

  hero: {
    eyebrow: 'Diagnóstico gratis para restaurantes',
    time: 'Viernes 21:30.',
    /** Fallback mientras no llegan los datos del local de ejemplo (en producción viene embebido en el HTML) */
    queryFallback: 'pizza cerca',
    /** Qué escribiría el cliente, según el tipo real del local de ejemplo: "pizza en Lanús" */
    queryNoun: {
      pizzeria: 'pizza',
      bar: 'bar',
      cafeteria: 'café',
      taqueria: 'tacos',
      hamburgueseria: 'hamburguesas',
      'dark-kitchen': 'delivery',
      restaurante: 'restaurante',
    } as Record<string, string>,
    query: (noun: string, city: string) => `${noun} en ${city}`,
    scene: (query: string) => `Alguien busca “${query}”.`,
    question: '¿Te encuentra, ve que estás abierto y te puede pedir?',
    searchLabel: 'Nombre de tu local',
    searchButton: 'Diagnosticar',
    searching: 'Buscando…',
    examples: ['Piki', 'El Campeón', "Red's Burger", 'Davvero', 'Ladina', 'Diavola'],
  },

  proof: {
    eyebrow: 'Prueba, no promesas',
    title: 'Así queda la comanda de un local real',
    intro: (city: string) =>
      `Es un local de ${city}. Rating, reseñas, horarios, web y apps salen de su ficha pública; el cobro y los canales son respuestas de ejemplo.`,
    cta: 'Ver su diagnóstico completo',
    tryMine: 'Hacer el diagnóstico de mi local',
  },

  home: {
    stepsTitle: 'Cómo es el diagnóstico',
    steps: [
      {
        n: '1',
        title: 'Tu local',
        body: 'Lo buscamos y traemos de su ficha pública el rating, las reseñas, los horarios, la web y las apps.',
      },
      {
        n: '2',
        title: 'Cuatro preguntas',
        body: 'Por dónde se vende, cómo se cobra y se factura, y cuántos locales son.',
      },
      {
        n: '3',
        title: 'Tu comanda',
        body: 'Una nota por área, qué mejorar primero y cuánta plata se escapa por mes (estimación simulada).',
      },
      {
        n: '4',
        title: 'Tu Fudo ya armado',
        body: 'Si encaja, la cuenta viene con nombre, dirección y horarios cargados (simulado en la demo).',
      },
    ],
    loadingTicket: 'Preparando la comanda de ejemplo…',
    ticketError: 'No pudimos cargar la comanda de ejemplo.',
  },

  /** <title>, description y textos de compartir de la home. Los de cada landing salen de copyFor(país).landing */
  seo: {
    appName: 'Diagnóstico gratis para restaurantes',
    homeTitle:
      'Diagnóstico gratis para restaurantes: Google Maps, apps de delivery y factura electrónica',
    homeDescription:
      'Viernes 21:30, alguien busca tu local: ¿te encuentra, ve que estás abierto y te puede pedir? Diagnóstico gratis para restaurantes de Argentina, México, Chile y Colombia.',
    appDescription:
      'Diagnóstico de la presencia online de un restaurante: ficha de Google, reseñas, web, apps de delivery y operación, con recomendaciones y una estimación (simulada) de la plata que se escapa por mes.',
    noscript: 'El diagnóstico necesita JavaScript. Mientras tanto, podés leer las guías.',
  },

  countriesNav: {
    title: 'Elegí tu país',
    lead: 'El diagnóstico usa las apps, el ente fiscal y la moneda de tu país.',
    link: (country: string) => `Diagnóstico para restaurantes en ${country}`,
  },

  guides: {
    title: 'Guías para dueños de restaurantes',
    all: 'Ver todas las guías',
  },

  confirm: {
    titleOne: '¿Es este tu local?',
    titleMany: '¿Cuál es tu local?',
    yes: 'Sí, es este',
    pick: 'Elegir este',
    back: 'Buscar de nuevo',
    noRating: 'Sin reseñas que podamos leer',
    reviews: (n: string) => `${n} reseñas`,
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
        options: {
          salon: 'En el salón',
          mostrador: 'Mostrador / retiro',
          apps: 'Apps de delivery',
          'delivery-propio': 'Delivery propio (WhatsApp, web)',
        } satisfies Record<SalesChannel, string>,
      },
      billing: {
        options: {
          manual: 'A mano: papel, Excel o calculadora',
          terminal: 'Solo con la terminal de tarjetas',
          'otro-sistema': 'Con otro sistema de gestión',
        } satisfies Record<BillingSetup, string>,
      },
      locals: {
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
    noScore: 'Sin datos suficientes',
    insufficient: 'Sin datos suficientes',
    partial: (known: number, total: number) => `Basada en ${known} de ${total} chequeos: el resto no lo pudimos leer`,
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

  /** La comanda: el resultado impreso como ticket de cocina */
  ticket: {
    header: 'Comanda de diagnóstico',
    local: 'Local',
    detail: 'Ver el detalle',
    hideDetail: 'Ocultar el detalle',
    overall: 'Nota general',
    outOf: '/100',
    money: 'TOTAL QUE SE TE ESCAPA POR MES',
    moneyApprox: 'Aproximadamente',
    moneyRange: (low: string, high: string) => `Rango razonable: entre ${low} y ${high}`,
    moneyZero: 'No detectamos plata que se escape de forma clara.',
    moneyDisclaimer:
      'Estimación simulada con supuestos propios de la demo, no un dato real de tu negocio.',
    sampleOperation: 'simulado: depende de las respuestas',
    sampleMoney: 'Con respuestas de ejemplo: salón y apps, cobro a mano, 1 local.',
    footer: 'Gracias por tu visita',
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
    web: { name: 'Web y redes', help: 'Web propia e Instagram (solo presencia, no actividad)' },
    delivery: { name: 'Delivery', help: 'En cuántas apps está y si tiene canal propio' },
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
    noWebsite: 'Sin web propia',
    daysLoaded: (n: number) => `${n} días cargados`,
    friday: (hours: string) => `viernes ${hours}`,
    ratingOnGoogle: (rating: string) => `${rating} en Google`,
    reviews: (n: string) => `${n} reseñas`,
    appsFound: (n: number) => `${n} ${n === 1 ? 'app encontrada' : 'apps encontradas'}`,
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
    how: '¿Cómo calculamos esto?',
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
        formula: 'ventas × % de merma según cómo se cobra hoy',
      },
    },
    assumptionsTitle: 'Supuestos (simulados, editables en el código)',
    assumptions: {
      appShare: 'Parte de los pedidos que entra por apps (si se vende por apps)',
      appShareDarkKitchen: 'Idem, para dark kitchen',
      appCommission:
        'Comisión de las apps. En Argentina la prensa informa 25%–35% (iProfesional, 14/05/2026); en el resto es un supuesto',
      redirectableShare: 'Parte de esos pedidos que podrías pasar a un canal propio',
      googleGapLoss: 'Ventas perdidas con la ficha de Google al 0%',
      billingManual: 'Merma si se cobra a mano',
      billingTerminal: 'Merma si se cobra solo con terminal',
      ticket: 'Ticket promedio (supuesto de la demo)',
      orders: 'Pedidos por mes por local, según volumen (supuesto de la demo)',
    },
  },

  neighbors: {
    badge: (date: string) => `real · capturado el ${date}`,
    colLocal: 'Local',
    colRating: 'Rating',
    colReviews: 'Reseñas',
    noData: 'Sin dato',
    sameCity: 'misma ciudad',
    sameType: 'mismo tipo',
  },

  footer: {
    title: 'Qué es real y qué es simulado',
    disclaimer:
      'Demo de entrevista, no es un sitio oficial de Fudo. Lo real lleva fuente y fecha; lo simulado está marcado como tal.',
    columns: { what: 'Qué', status: 'Estado', detail: 'Detalle' },
    rows: [
      {
        what: 'Datos del local (nombre, dirección, rating, reseñas, horarios, web, delivery)',
        status: 'real',
        detail:
          'Locales reales capturados el 26/10/2026 de la ficha pública de Google y de las apps. Solo para la demo: en producción se consultan en vivo a Google Places.',
      },
      {
        what: 'Comparación con otros locales',
        status: 'real',
        detail: 'Rating y reseñas de los otros locales reales de la demo del mismo país. No es un promedio de mercado.',
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
    unofficial: 'Demo de entrevista · no es un sitio oficial de Fudo. La marca Fudo pertenece a sus dueños.',
  },

  debug: {
    title: 'Panel de eventos',
    documentTitle: 'Panel de eventos (debug) | Diagnóstico gratis para restaurantes',
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

// ═══════════════════════════════════════════════════════════════════════════
//  2) VOZ POR PAÍS: base (voseo, Argentina) + overrides
// ═══════════════════════════════════════════════════════════════════════════

/** Datos de countries.json que usan los textos de las landings (nunca se escriben a mano) */
export interface LandingFacts {
  country: string
  apps: string[]
  authority: string
  currencyCode: string
}

const andList = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`

/** BASE = voseo rioplatense (Argentina). Todo lo que un país no pise se hereda de acá. */
const base = {
  /** Etiqueta de la voz, para los tests y el panel */
  voice: 'voseo' as 'voseo' | 'tuteo',

  hero: {
    subtitle: (apps: string[]) =>
      apps.length
        ? `Revisamos tu ficha de Google, tus reseñas, tu web y tus apps (${andList(apps)}) en 60 segundos. Sin tarjeta y sin registro.`
        : 'Revisamos tu ficha de Google, tus reseñas, tu web y tus apps de delivery en 60 segundos. Sin tarjeta y sin registro.',
    placeholder: 'Ej.: Pizzería Piki, Lanús',
    examplesLabel: 'O probá con un local real de la demo:',
    tooShort: 'Escribí al menos 2 letras.',
    searchError: 'No pudimos buscar ahora. Probá de nuevo en un rato.',
    trust: [
      'Usa datos públicos de tu local',
      'Sin tarjeta ni registro',
      'La nota sale de reglas que podés ver',
    ],
  },

  result: {
    notApplicable: 'No aplica: no vendés por delivery',
    sampleBanner:
      'Estás viendo el diagnóstico de un local real con respuestas de ejemplo (simuladas). Probá con el tuyo.',
  },

  /** Búsqueda sin coincidencia real: nunca se muestra otro local como si fuera el del dueño */
  notFound: {
    title: (query: string) => `No encontramos «${query}»`,
    body: (n: number) =>
      `Esta demo cubre ${n} locales reales y puede que el tuyo no esté. Nunca te mostramos otro local como si fuera el tuyo. En producción la búsqueda usa Google Places y encuentra cualquier local.`,
    pickIn: (country: string) => `Probá con uno de la demo en ${country}:`,
    pickOthers: 'Locales de otros países:',
    pickAny: 'Probá con uno de la demo:',
  },

  questions: {
    channelsTitle: '¿Por dónde vendés hoy?',
    channelsHint: 'Podés marcar varias.',
    billingTitle: '¿Cómo cobrás y facturás hoy?',
    billingHint: (authority: string) => `Pensá en cómo emitís el comprobante ante ${authority}.`,
    localsTitle: '¿Cuántos locales tenés?',
  },

  /** Cada área de la comanda como pregunta de dueño. El id interno del área no cambia. */
  ticket: {
    areaQuestion: {
      google: '¿Te encuentran?',
      reviews: '¿Te eligen?',
      web: '¿Te pueden pedir sin comisión?',
      delivery: '¿Estás en las apps que usa tu barrio?',
      operation: '¿Cobrás y facturás sin errores?',
    } satisfies Record<AreaId, string>,
  },

  neighbors: {
    you: 'vos',
    title: (place: string) => `Cómo estás contra otros locales de la demo en ${place}`,
    intro: (n: number) =>
      n === 1 ? 'Lo comparamos con otro local real de la demo.' : `Lo comparamos con otros ${n} locales reales de la demo.`,
    reviewsRange: (min: string, max: string) => `Reseñas de los otros: entre ${min} y ${max}`,
    ratingRange: (min: string, max: string) =>
      min === max ? `Rating de los otros: ${min}` : `Rating de los otros: entre ${min} y ${max}`,
    reviewsRank: (position: number, outOf: number, own: string) =>
      `Con ${own} reseñas estás ${position === 1 ? 'primero' : `en el puesto ${position}`} de ${outOf} en cantidad de reseñas.`,
    ratingRank: (position: number, outOf: number, own: string) =>
      `Con ${own} de rating estás ${position === 1 ? 'primero' : `en el puesto ${position}`} de ${outOf}.`,
    noOwnData: 'No pudimos leer tu rating ni tus reseñas, así que no te ubicamos en el ranking.',
    sameCityNote: (n: number, city: string) =>
      `${n === 1 ? '1 es' : `${n} son`} de ${city}, tu misma ciudad.`,
    scale: 'Reseñas de cada local, de menos a más',
    note: 'Compará solo lo comparable: son pocos locales y no representan el mercado.',
  },

  money: {
    howIntro: 'Es una cuenta simple, con números que podés discutir. Estos son los pasos y todos los supuestos:',
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

  /** Recomendaciones: el cuándo vive en src/domain/recommendations.ts, el texto, acá */
  recs: {
    googleHours: {
      title: 'Completá tus horarios en Google',
      bodyAbsent:
        'Tu ficha no tiene horarios cargados: quien te busca no sabe si estás abierto y elige a otro.',
      bodyUnknown:
        'No pudimos leer tus horarios. Revisá que estén completos en tu ficha de Google, incluidos feriados.',
    },
    googleListing: {
      title: 'Reforzá tu ficha de Google',
      body: 'Sumá descripción, categoría, precios y fotos actualizadas. La herramienta te redacta los textos listos para pegar.',
    },
    reviewsFew: {
      title: 'Conseguí más reseñas en Google',
      body: (count: string) =>
        `Tenés ${count} reseñas. Con tan poca muestra, ni el rating ni el volumen te ayudan a aparecer arriba. Pedí la reseña en la mesa y en cada pedido por delivery.`,
    },
    reviewsRating: {
      title: 'Entendé por qué tu rating está bajo',
      body: (rating: string) =>
        `Tu nota en Google es ${rating}. Leer qué se repite en las quejas te dice qué arreglar primero.`,
    },
    webMissing: {
      title: 'Armá tu web gratis',
      body: 'Tu ficha de Google no tiene sitio web propio. Con una web simple (carta, horarios, ubicación y WhatsApp) dejás de depender de redes y apps.',
    },
    instagramMissing: {
      title: 'Abrí un Instagram del local',
      body: 'No encontramos un perfil de Instagram. No medimos su actividad (no tenemos acceso real a esa métrica), solo que exista.',
    },
    cartaQr: {
      title: 'Subí tu carta en 30 segundos',
      body: 'Sacale una foto a tu carta y la herramienta arma una carta digital con QR para la mesa y para compartir por WhatsApp.',
    },
    deliveryCommission: {
      title: 'Armá tu canal propio de delivery',
      /** solo vende por apps */
      onlyApps: (apps: string) => `Hoy vendés solo por apps (${apps}) y cada pedido paga comisión.`,
      /** vende por apps y también en el salón y/o el mostrador */
      withOthers: (where: string, apps: string) =>
        `Además ${where}, vendés por apps (${apps}) y cada pedido que entra por ahí paga comisión.`,
      /** no marcó apps, pero el local figura en alguna */
      unmarked: (n: number, apps: string) =>
        `Aunque no marcaste las apps, tu local figura en ${n} (${apps}) y cada pedido que entra por ahí paga comisión.`,
      closing: 'Un canal propio por WhatsApp o tienda online te deja ese margen.',
      where: { salon: 'del salón', mostrador: 'del mostrador', both: 'del salón y el mostrador' },
      commissionGeneric: 'Cada app cobra una comisión por venta.',
    },
    deliveryCentralize: {
      title: 'Juntá todos los pedidos en una pantalla',
      body: (n: number) =>
        `Estás en ${n} apps de delivery. Con un módulo que las centralice, los pedidos entran a la misma cola de cocina y dejás de saltar entre tablets.`,
    },
    deliveryOneApp: {
      title: 'No dependas de una sola app',
      body: (country: string, apps: string) =>
        `Solo encontramos tu local en una app. En ${country} las más usadas son ${apps}: sumar otra te da alcance, pero medí antes cuánto te cuesta la comisión.`,
    },
    opsBillingManual: {
      title: (authority: string) => `Dejá de cobrar y facturar a mano (${authority})`,
      body: (pitch: string) =>
        `Cobrar a mano genera errores de caja y comprobantes tardíos. ${pitch}`,
    },
    opsTerminalOnly: {
      title: 'Conectá el cobro con tu gestión',
      body: 'Cobrar solo con la terminal deja las ventas sin stock, sin reportes y sin comprobante unificado. Un sistema que cobre y registre a la vez te muestra cuánto vendés de verdad.',
    },
    opsMultiLocal: {
      title: 'Mirá todos tus locales juntos',
      body: 'Con más de un local y sin un sistema común, no hay forma de comparar ventas ni controlar el stock de cada uno. Los reportes consolidados lo resuelven.',
    },
    allGood: {
      title: 'Tu presencia online está sólida: ahora cuidá la reputación',
      body: 'No detectamos fallas claras con los datos que tenemos. Leé qué dicen tus clientes para mantener el nivel.',
    },
  },

  /** Landings por país (/ar/, /mx/, /cl/, /co/): title, H1, description y bloques con apps, ente fiscal y moneda */
  landing: {
    /** frase corta del comprobante local, para el title/H1: "factura ARCA" */
    fiscalPhrase: 'factura ARCA',
    currencyName: 'pesos argentinos',
    title: (f: LandingFacts, fiscalPhrase: string) =>
      `Diagnóstico gratis para tu restaurante en ${f.country}: Google Maps, ${f.apps.slice(0, 2).join(', ')} y ${fiscalPhrase}`,
    description: (f: LandingFacts) =>
      `Buscá tu local en ${f.country}: ¿te encuentran en Google Maps, estás en ${andList(f.apps.slice(0, 2))} y facturás bien ante ${f.authority}? Gratis, sin registro, en ${f.currencyCode}.`,
    factsTitle: (country: string) => `Lo que mira el diagnóstico en ${country}`,
    factApps: (apps: string) => `Apps de delivery: ${apps}. Vemos en cuáles está tu local y si tenés canal propio.`,
    factFiscal: (authority: string, system: string) =>
      `Facturación: ${authority} (${system}). Te preguntamos cómo cobrás y facturás hoy.`,
    factMoney: (currencyName: string, code: string, ticket: string) =>
      `Moneda: ${currencyName} (${code}). La plata que se te escapa se calcula con un ticket promedio supuesto de ${ticket} (simulado).`,
    factPlan: (name: string, price: string, date: string) =>
      `Fudo: ${name} desde ${price} por mes, precio publicado en fu.do (capturado el ${date}).`,
    placesTitle: (country: string) => `Locales reales de la demo en ${country}`,
    placesIntro: 'Tocá uno para ver su diagnóstico con respuestas de ejemplo, o buscá el tuyo arriba.',
    guidesTitle: (country: string) => `Guías para restaurantes de ${country}`,
    otherCountries: 'Otros países',
    breadcrumbHome: 'Inicio',
  },
}

export type Voice = typeof base

type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T

/**
 * TUTEO neutro (México, Chile, Colombia). Solo lo que cambia respecto del voseo.
 * Si una frase es igual en las dos voces, no se repite acá.
 */
const tuteo: DeepPartial<Voice> = {
  voice: 'tuteo',
  hero: {
    examplesLabel: 'O prueba con un local real de la demo:',
    tooShort: 'Escribe al menos 2 letras.',
    searchError: 'No pudimos buscar ahora. Prueba de nuevo en un rato.',
    trust: [
      'Usa datos públicos de tu local',
      'Sin tarjeta ni registro',
      'La nota sale de reglas que puedes ver',
    ],
  },
  result: {
    notApplicable: 'No aplica: no vendes por delivery',
    sampleBanner:
      'Estás viendo el diagnóstico de un local real con respuestas de ejemplo (simuladas). Prueba con el tuyo.',
  },
  notFound: {
    pickIn: (country) => `Prueba con uno de la demo en ${country}:`,
    pickAny: 'Prueba con uno de la demo:',
  },
  questions: {
    channelsTitle: '¿Por dónde vendes hoy?',
    channelsHint: 'Puedes marcar varias.',
    billingTitle: '¿Cómo cobras y facturas hoy?',
    billingHint: (authority) => `Piensa en cómo emites el comprobante ante ${authority}.`,
    localsTitle: '¿Cuántos locales tienes?',
  },
  ticket: {
    areaQuestion: { operation: '¿Cobras y facturas sin errores?' },
  },
  neighbors: {
    you: 'tú',
    note: 'Compara solo lo comparable: son pocos locales y no representan el mercado.',
  },
  money: {
    howIntro: 'Es una cuenta simple, con números que puedes discutir. Estos son los pasos y todos los supuestos:',
  },
  route: {
    reasons: {
      cadena: 'Tienes 4 o más locales.',
      'nucleo-sin-sistema': 'Vendes con volumen y por delivery, y hoy no tienes un sistema que lo ordene.',
      'nucleo-con-sistema': 'Vendes con volumen y por delivery, y ya usas otro sistema.',
      'poco-volumen': 'Todavía tienes pocas reseñas, lo que indica poco volumen.',
      'sin-delivery': 'No vendes por delivery.',
    },
    caliente: {
      intro:
        'Con los datos que ya tenemos de tu local, armamos cómo te quedaría la cuenta. Revísala y créala.',
    },
    switcher: {
      title: (product) => `Pásate a ${product} sin empezar de cero`,
      intro: 'Ya tienes un sistema, así que lo que importa es no perder lo que cargaste. Mira cómo quedaría tu cuenta.',
      migrateBody:
        'Puedes importar tus productos desde un Excel. En la demo no se importa nada: es una simulación.',
    },
    preview: { hoursMissing: 'No pudimos leer tus horarios: los cargas en un minuto.' },
    modal: {
      doneBody: 'No se creó ninguna cuenta. Para crear la cuenta real, sigue al alta oficial.',
    },
    nutrir: {
      intro: 'Con lo que contaste, lo mejor es mejorar tu presencia antes de invertir en gestión. Estas guías gratis son para ti:',
      emailLabel: 'Tu email, por si quieres recibir más guías',
      emailButton: 'Mándame las guías',
      emailInvalid: 'Escribe un email válido.',
    },
  },
  recs: {
    googleHours: {
      title: 'Completa tus horarios en Google',
      bodyUnknown:
        'No pudimos leer tus horarios. Revisa que estén completos en tu ficha de Google, incluidos feriados.',
    },
    googleListing: {
      title: 'Refuerza tu ficha de Google',
      body: 'Suma descripción, categoría, precios y fotos actualizadas. La herramienta te redacta los textos listos para pegar.',
    },
    reviewsFew: {
      title: 'Consigue más reseñas en Google',
      body: (count) =>
        `Tienes ${count} reseñas. Con tan poca muestra, ni el rating ni el volumen te ayudan a aparecer arriba. Pide la reseña en la mesa y en cada pedido por delivery.`,
    },
    reviewsRating: { title: 'Entiende por qué tu rating está bajo' },
    webMissing: {
      title: 'Arma tu web gratis',
      body: 'Tu ficha de Google no tiene sitio web propio. Con una web simple (carta, horarios, ubicación y WhatsApp) dejas de depender de redes y apps.',
    },
    instagramMissing: { title: 'Abre un Instagram del local' },
    cartaQr: {
      title: 'Sube tu carta en 30 segundos',
      body: 'Sácale una foto a tu carta y la herramienta arma una carta digital con QR para la mesa y para compartir por WhatsApp.',
    },
    deliveryCommission: {
      title: 'Arma tu canal propio de delivery',
      onlyApps: (apps) => `Hoy vendes solo por apps (${apps}) y cada pedido paga comisión.`,
      withOthers: (where, apps) =>
        `Además ${where}, vendes por apps (${apps}) y cada pedido que entra por ahí paga comisión.`,
    },
    deliveryCentralize: {
      title: 'Junta todos los pedidos en una pantalla',
      body: (n) =>
        `Estás en ${n} apps de delivery. Con un módulo que las centralice, los pedidos entran a la misma cola de cocina y dejas de saltar entre tablets.`,
    },
    deliveryOneApp: {
      body: (country, apps) =>
        `Solo encontramos tu local en una app. En ${country} las más usadas son ${apps}: sumar otra te da alcance, pero mide antes cuánto te cuesta la comisión.`,
    },
    opsBillingManual: {
      title: (authority) => `Deja de cobrar y facturar a mano (${authority})`,
    },
    opsTerminalOnly: {
      title: 'Conecta el cobro con tu gestión',
      body: 'Cobrar solo con la terminal deja las ventas sin stock, sin reportes y sin comprobante unificado. Un sistema que cobre y registre a la vez te muestra cuánto vendes de verdad.',
    },
    opsMultiLocal: { title: 'Mira todos tus locales juntos' },
    allGood: {
      title: 'Tu presencia online está sólida: ahora cuida la reputación',
      body: 'No detectamos fallas claras con los datos que tenemos. Lee qué dicen tus clientes para mantener el nivel.',
    },
  },
  landing: {
    factApps: (apps) => `Apps de delivery: ${apps}. Vemos en cuáles está tu local y si tienes canal propio.`,
    factFiscal: (authority, system) =>
      `Facturación: ${authority} (${system}). Te preguntamos cómo cobras y facturas hoy.`,
    placesIntro: 'Toca uno para ver su diagnóstico con respuestas de ejemplo, o busca el tuyo arriba.',
  },
}

/** Overrides por país: lo que no está acá se hereda del base (voseo, Argentina). */
const OVERRIDES: Record<CountryCode, DeepPartial<Voice>> = {
  AR: {},
  MX: {
    ...tuteo,
    hero: { ...tuteo.hero, placeholder: "Ej.: Red's Burger, Zapopan" },
    landing: {
      ...tuteo.landing,
      fiscalPhrase: 'factura CFDI del SAT',
      currencyName: 'pesos mexicanos',
    },
  },
  CL: {
    ...tuteo,
    hero: { ...tuteo.hero, placeholder: 'Ej.: Davvero, Ñuñoa' },
    landing: {
      ...tuteo.landing,
      fiscalPhrase: 'boleta electrónica del SII',
      currencyName: 'pesos chilenos',
    },
  },
  CO: {
    ...tuteo,
    hero: { ...tuteo.hero, placeholder: 'Ej.: El Social, Medellín' },
    landing: {
      ...tuteo.landing,
      fiscalPhrase: 'factura electrónica de la DIAN',
      currencyName: 'pesos colombianos',
    },
  },
  // Brasil: el contenido sigue en español (recorte declarado); usa tuteo neutro
  BR: { ...tuteo, hero: { ...tuteo.hero, placeholder: 'Ej.: Diavola Pizzaria, Pinheiros' } },
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Mezcla profunda: los objetos se combinan; funciones, strings y arrays del override reemplazan al base. */
function merge<T>(baseValue: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return baseValue
  if (!isPlainObject(baseValue) || !isPlainObject(override)) return override as T
  const out: Record<string, unknown> = { ...baseValue }
  for (const [key, value] of Object.entries(override)) {
    out[key] = merge(baseValue[key], value as never)
  }
  return out as T
}

const cache = new Map<string, Voice>()

/**
 * Textos con la voz y los nombres del país del local. `null` (todavía no sabemos el país) usa el base.
 * Ej.: copyFor('MX').questions.billingTitle === '¿Cómo cobras y facturas hoy?'
 */
export function copyFor(country: CountryCode | null): Voice {
  const key = country ?? 'base'
  let voice = cache.get(key)
  if (!voice) {
    voice = merge<Voice>(base, country ? OVERRIDES[country] : undefined)
    cache.set(key, voice)
  }
  return voice
}

/** Los textos de los que se arma cada tipo de recomendación (los usa src/domain/recommendations.ts) */
export type RecsCopy = Voice['recs']
