interface PropType<N extends string, T> {
	type: N
	value: T
	ref?: string
	optional?: boolean
	repeated?: boolean
}

export type Properties = Record<string, Prop>

export type CommonPropType = PropType<'common', string | number | boolean>
export type UnionPropType = PropType<'union', (string | number | boolean)[]>
export type EmbeddedPropType = PropType<'embedded', Properties>
export type UnknownPropType = PropType<'unknown', undefined>

export type Prop = CommonPropType | UnionPropType | EmbeddedPropType | UnknownPropType

export interface Model {
	name: string
	props: Properties
}
