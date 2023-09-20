import      { Schema }           from 'mongoose'

import type { EmbeddedPropType } from '../types/index.js'
import type { Prop }             from '../types/index.js'
import type { UnionPropType }    from '../types/index.js'
import type { UnknownPropType }  from '../types/index.js'

export function getSchemaTree(schema: Schema) {
	return Reflect.get(schema, 'tree')
}

export function transformProperties(props: Record<string, any>) {
	return Object.fromEntries(Object.entries(props).map(([key, value]) => [key, transformProperty(value)]))
}

export function transformProperty(prop: any): Prop {
	const repeated = Array.isArray(prop.type)
	const normalizedType = repeated ? prop.type.at(0)! : prop.type
	const { enum: enumObj } = prop

	const common: Partial<Prop> = {
		optional: !(prop.required ?? prop.isRequired ?? true),
		ref: prop.ref,
		repeated,
	}

	if (normalizedType instanceof Schema) {
		return {
			type: 'embedded',
			value: transformProperties(getSchemaTree(normalizedType)),
			...common,
		} as EmbeddedPropType
	}

	if (enumObj) {
		return {
			type: 'union',
			value: Object.values(enumObj),
			...common,
		} as UnionPropType
	}

	if (typeof normalizedType === 'function') {
		return {
			type: 'common',
			value: normalizedType.name,
			...common,
		}
	}

	if (typeof normalizedType === 'object') {
		return {
			type: 'embedded',
			value: transformProperties(normalizedType),
			...common,
		} as EmbeddedPropType
	}

	return {
		type: 'unknown',
		...common,
	} as UnknownPropType
}
