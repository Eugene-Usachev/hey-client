const dictionaries = {
	en: () => import('../dictionaries/en.json').then((module) => module.default),
	ru: () => import('../dictionaries/ru.json').then((module) => module.default),
}

export let lang = {current: "en"}

export const getDictionary = async () => dictionaries[lang.current]()