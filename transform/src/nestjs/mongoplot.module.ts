import { DynamicModule }       from '@nestjs/common'
import { Module }              from '@nestjs/common'
import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage.js'

import { PLOT_REDIRECT }       from './constants.js'
import { PLOT_TARGETS }        from './constants.js'
import { MongoplotController } from './mongoplot.controller.js'
import { RedirectOptions }     from './types.js'

function filterSchemas(value: any) {
	return Boolean(TypeMetadataStorage.getSchemaMetadataByTarget(value))
}

@Module({})
export class MongoplotModule {
	static register(mod: Array<any> | Record<string, any>, redirectOptions: RedirectOptions = {}): DynamicModule {
		return {
			module: MongoplotModule,
			providers: [
				{
					provide: PLOT_TARGETS,
					useValue: (() => {
						if (Array.isArray(mod)) {
							return mod.filter(filterSchemas)
						}

						if (typeof mod === 'object') {
							return Object.values(mod).filter(filterSchemas)
						}

						throw new Error('Failed to register mongoplot targets')
					})(),
				},
				{
					provide: PLOT_REDIRECT,
					useValue: (() => {
						const publicUrl = redirectOptions?.publicUrl ?? process.env.PUBLIC_URL ?? 'http://localhost:8000/'
						const printUrl = redirectOptions.printUrl ?? new URL('mongoplot/print', publicUrl)

						return new URL(
							encodeURIComponent(printUrl.toString()),
							redirectOptions.mongoplotUrl ?? 'https://mongoplot.vercel.app/',
						)
					})(),
				},
			],
			controllers: [MongoplotController],
		}
	}
}
