const BLACKFILES_DATA = {
  entities: [
  {
    id: "father-grigory",
    name: "Отец Григорий",
    role: "Законник / Лидер",
    tier: "top",
    status: "active",
    label: "LIEUTENANT",
    threat: "apex",
    image: "assets/images/entities/grigory.jpg",
    summary: "Глава основной ветки Инквизиторов. Центральная фигура всей структуры.",
    notes: "От него расходятся все лейтенанты.",
    dossier: "#",
  },

  {
    id: "ajax",
    name: "Аякс",
    role: "МедТех",
    tier: "lieutenant",
    status: "active",
    threat: "critical",
    image: "assets/images/entities/ajax.jpg",
    summary: "Лейтенант группировки Инквизиторов. Завербован НЕИЗВЕСТНО. Объект обладает высоким уровнем медицинской подготовки и боевого опыта.",
    notes: "Специализируется на полевых извлечениях имплантов (голоми руками). Демонстрирует аномальную регенерацию и крайне высокую реакцию, что делает его почти неуязвимым в бою. Ранее работал на корпорацию NOVIMMUNE в составе научной экспедиции в Бразилии. Позднее был замечен в Найт-Сити, где вмешивался в операции нашей группы и вступал в открытый бой.",
    dossier: "dossiers/ajax.html",
  },

  {
    id: "asgard",
    name: "Асгард",
    role: "Кочевник",
    tier: "lieutenant",
    status: "active",
    threat: "high",
    image: "assets/images/entities/asgard.jpg",
    summary: "Лейтенант ветки, завязанный на логистику и мобильные каналы.",
    notes: "Подчинён О. Григорию.",
    dossier: "dossiers/asgard.html",
  },

  {
    id: "yuri",
    name: "Юрий",
    role: "Соло",
    tier: "lieutenant",
    status: "unknown",
    threat: "high",
    image: "assets/images/entities/yuri.jpg",
    summary: "Профиль не заполнен. Ожидается дополнительная информация.",
    notes: "",
    dossier: "#",
  },

  {
    id: "1848",
    name: "1848",
    role: "Фиксер",
    tier: "lieutenant",
    status: "active",
    threat: "high",
    image: "assets/images/entities/1848.jpg",
    summary: "Профиль не заполнен. Ожидается дополнительная информация.",
    notes: "Роль: Корпорат.",
    dossier: "#",
  },

  {
    id: "kuklovod",
    name: "Кукловод",
    role: "Техник",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Техник.",
    dossier: "#",
  },

  {
    id: "nexus",
    name: "Нексус",
    role: "Нетраннер",
    tier: "linked",
    status: "unknown",
    threat: "critical",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Нетраннер.",
    dossier: "#",
  },

  {
    id: "alma",
    name: "Альма???",
    role: "Корпорат",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Корпорат.",
    dossier: "#",
  },

  {
    id: "harlequin",
    name: "Арлекин",
    role: "Рокербой",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "assets/images/entities/harlequin.jpg",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Рокербой.",
    dossier: "#",
  },

  {
    id: "morfey",
    name: "Морфей",
    role: "Медиа",
    tier: "linked",
    status: "unknown",
    threat: "critical",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Медиа.",
    dossier: "#",
  },
   
  {
    id: "cyberplague",
    name: "Киберчума",
    role: "Аномалия",
    tier: "external",
    threat: "omega",
    image: "assets/images/entities/cyberplague.jpg",
    summary: "Н неконтролируемая катастрофическая сущность, уничтожившая регион.",
    notes: "Не относится напрямую к основной ветке инквизиторов.",
    dossier: "#"
  },

    {
    id: "mexican",
    name: "Банда Мексиканцев",
    role: "Аномалия",
    tier: "external",
    threat: "vector",
    image: "assets/images/ally/cartel.jpg",
    summary: "111",
    notes: "Не относится напрямую к основной ветке инквизиторов.",
    dossier: "#"
  }

],
  
  links: [
  { from: "father-grigory", to: "ajax" },
  { from: "father-grigory", to: "asgard" },
  { from: "father-grigory", to: "harlequin"}, 
  { from: "father-grigory", to: "yuri"},
  { from: "father-grigory", to: "1848"},
  { from: "father-grigory", to: "nexus"},
  { from: "father-grigory", to: "kuklovod" },
  { from: "father-grigory", to: "alma" },
  { from: "father-grigory", to: "morfey" },
  { from: "nexus", to: "cyberplague" },
  { from: "mexican", to: "1848" },
]
  
};
