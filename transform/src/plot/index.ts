import { DefinitionsFactory }  from '@nestjs/mongoose'

import { getNodePosition }     from '../nestjs/index.js'
import { Model }               from '../types/index.js'
import { transformProperties } from './helpers.js'

export function plot(classes: Array<new () => object>) {
	const definitions = classes.map((cls) => [cls, cls.name, DefinitionsFactory.createForClass(cls)] as const)

	return definitions.map(
		([cls, name, def]) =>
			({
				name,
				props: transformProperties(def),
				position: getNodePosition(cls),
			}) satisfies Model,
	)
}
