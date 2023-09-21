import { SetMetadata } from '@nestjs/common'

export const NODE_POSITION = Symbol('NODE_POSITION')

export const NodePosition = (x: number, y: number) => SetMetadata(NODE_POSITION, { x, y })

export function getNodePosition(target: any) {
	return Reflect.getMetadata(NODE_POSITION, target)
}
