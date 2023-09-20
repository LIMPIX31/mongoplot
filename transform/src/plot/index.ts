import { DefinitionsFactory }  from '@nestjs/mongoose'

import { Model }               from '../types/index.js'
import { transformProperties } from './helpers.js'

export function plot(classes: Array<new () => object>) {
	const definitions = classes.map((cls) => [cls.name, DefinitionsFactory.createForClass(cls)] as const)

	return definitions.map(
		([name, def]) =>
			({
				name,
				props: transformProperties(def),
			}) satisfies Model,
	)
}
