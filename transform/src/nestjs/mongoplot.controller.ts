import { Controller }    from '@nestjs/common'
import { Get }           from '@nestjs/common'
import { Inject }        from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { ApiTags }       from '@nestjs/swagger'

import { plot }          from '../plot/index.js'
import { PLOT_TARGETS }  from './constants.js'

@Controller('mongoplot')
@ApiTags('mongoplot')
export class MongoplotController {
	constructor(@Inject(PLOT_TARGETS) private readonly targets: any[]) {}

	@Get('print')
	@ApiOkResponse({ description: 'Prints db schema in json' })
	async print() {
		return plot(this.targets)
	}
}
