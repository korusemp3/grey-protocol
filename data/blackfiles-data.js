const BLACKFILES_DATA = {
  entities: [
  {
    id: "father-grigory",
    name: "Отец Григорий",
    role: "Законник / Лидер",
    tier: "top",
    status: "active",
    threat: "apex",
    image: "ssets/images/entities/father-grigory.jpg",
    summary: "Глава основной ветки Инквизиторов. Центральная фигура всей структуры.",
    notes: "От него расходятся все лейтенанты.",
    dossier: "#",
    position: { x: 50, y: 6 }
  },

  {
    id: "ajax",
    name: "Аякс",
    role: "МедТех",
    tier: "lieutenant",
    status: "active",
    threat: "critical",
    image: "assets/images/entities/ajax.jpg",
    summary: "Лейтенант ветки, связанный с медтех-направлением.",
    notes: "Подчинён О. Григорию.",
    dossier: "#",
    position: { x: 18, y: 34 }
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
    dossier: "#",
    position: { x: 38, y: 34 }
  },

  {
    id: "yuri",
    name: "Юрий",
    role: "Соло",
    tier: "lieutenant",
    status: "unknown",
    threat: "medium",
    image: "assets/images/entities/yuri.jpg",
    summary: "Профиль не заполнен. Ожидается дополнительная информация.",
    notes: "",
    dossier: "#",
    position: { x: 58, y: 34 }
  },

  {
    id: "1848",
    name: "1848",
    role: "Фиксер",
    tier: "lieutenant",
    status: "active",
    threat: "medium",
    image: "assets/images/entities/1848.jpg",
    summary: "Профиль не заполнен. Ожидается дополнительная информация.",
    notes: "Роль: Корпорат.",
    dossier: "#",
    position: { x: 78, y: 34 }
  },

  {
    id: "unknown-technician",
    name: "Неизвестный",
    role: "Техник",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Техник.",
    dossier: "#",
    position: { x: 14, y: 68 }
  },

  {
    id: "unknown-netrunner",
    name: "Неизвестный",
    role: "Нетраннер",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Нетраннер.",
    dossier: "#",
    position: { x: 30, y: 68 }
  },

  {
    id: "unknown-lawman",
    name: "Неизвестный",
    role: "Корпорат",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Корпорат.",
    dossier: "#",
    position: { x: 50, y: 68 }
  },

  {
    id: "harlequin",
    name: "Арлекин",
    role: "Рокербой",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "ssets/images/entities/harlequin.jpg",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Рокербой.",
    dossier: "#",
    position: { x: 70, y: 68 }
  },

  {
    id: "unknown-media",
    name: "Неизвестный",
    role: "Медиа",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Медиа.",
    dossier: "#",
    position: { x: 86, y: 68 }
  }
],
  
  links: [
  { from: "father-grigory", to: "ajax" },
  { from: "father-grigory", to: "asgard" },
  { from: "father-grigory", to: "harlequin"}, 
  { from: "father-grigory", to: "yuri"},
  { from: "father-grigory", to: "1848"},
  { from: "father-grigory", to: "unknown-netrunner"},
  { from: "father-grigory", to: "unknown-technician" },
  { from: "father-grigory", to: "unknown-corporate" },
  { from: "father-grigory", to: "unknown-media" },
]
  
};
