const dictionaries = {
	eng: () => import('../dictionaries/en.json').then((module) => module.default),
	ru: () => import('../dictionaries/ru.json').then((module) => module.default),
}

export let lang = {current: "eng"}

export const getDictionary = async () => dictionaries[lang.current]()

export const getDictionaryByLang = async (lang: string) => {
	// @ts-ignore
	return dictionaries[lang]();
}