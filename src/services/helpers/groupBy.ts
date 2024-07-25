const groupBy = <T, Q>(array: T[], predicate: (value: T, index: number, array: T[]) => Q) => {
	return array.reduce((map, value, index, array) => {
		const key = predicate(value, index, array)
		const existingArray = map.get(key)
		if (existingArray) {
			existingArray.push(value)
		} else {
			map.set(key, [value])
		}
		return map
	}, new Map<Q, T[]>())
}
export default groupBy
