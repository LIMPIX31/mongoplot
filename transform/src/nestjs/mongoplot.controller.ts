import      { Controller }    from '@nestjs/common'
import      { Res }           from '@nestjs/common'
import      { Get }           from '@nestjs/common'
import      { Inject }        from '@nestjs/common'
import type { Response }      from 'express'

import      { plot }          from '../plot/index.js'
import      { PLOT_REDIRECT } from './constants.js'
import      { PLOT_TARGETS }  from './constants.js'

@Controller('mongoplot')
export class MongoplotController {
	constructor(
		@Inject(PLOT_TARGETS) private readonly targets: any[],
		@Inject(PLOT_REDIRECT) private readonly redirect: string,
	) {}

	@Get('/')
	async redirectToMongoplot(@Res() res: Response) {
		return res.redirect(301, this.redirect)
	}

	@Get('print')
	async print() {
		return plot(this.targets)
	}
}
