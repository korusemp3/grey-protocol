const BLACKFILES_DATA = {
  entities: [
  {
    id: "father-grigory",
    name: "Отец Григорий",
    role: "Соло / Лидер",
    tier: "top",
    status: "active",
    threat: "critical",
    image: "",
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
    threat: "high",
    image: "",
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
    image: "",
    summary: "Лейтенант ветки, завязанный на логистику и мобильные каналы.",
    notes: "Подчинён О. Григорию.",
    dossier: "#",
    position: { x: 38, y: 34 }
  },

  {
    id: "unknown-technician",
    name: "Неизвестный",
    role: "Техник",
    tier: "lieutenant",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Профиль не заполнен. Ожидается дополнительная информация.",
    notes: "Роль: Техник.",
    dossier: "#",
    position: { x: 58, y: 34 }
  },

  {
    id: "unknown-corporate",
    name: "Неизвестный",
    role: "Корпорат",
    tier: "lieutenant",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Профиль не заполнен. Ожидается дополнительная информация.",
    notes: "Роль: Корпорат.",
    dossier: "#",
    position: { x: 78, y: 34 }
  },

  {
    id: "unknown-fixer",
    name: "Неизвестный",
    role: "Фиксер",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Фиксер.",
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
    role: "Законник",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
    summary: "Связанный элемент. Профиль пока неполный.",
    notes: "Роль: Законник.",
    dossier: "#",
    position: { x: 50, y: 68 }
  },

  {
    id: "unknown-rockerboy",
    name: "Неизвестный",
    role: "Рокербой",
    tier: "linked",
    status: "unknown",
    threat: "medium",
    image: "",
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
  { from: "father-grigory", to: "unknown-technician" },
  { from: "father-grigory", to: "unknown-corporate" },

  { from: "ajax", to: "unknown-fixer" },
  { from: "ajax", to: "unknown-netrunner" },

  { from: "asgard", to: "unknown-lawman" },
  { from: "asgard", to: "unknown-rockerboy" },
  { from: "asgard", to: "unknown-media" }
]
  
};
