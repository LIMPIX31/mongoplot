import      { Node }  from 'reactflow'
import type { Model } from 'types/index.js'
import type { Prop }  from 'types/index.js'

function extractRefsFromProp(name: string, prop: Prop, path?: string): Record<string, string> {
	if (prop.ref) {
		return { [path ? `${path}.${name}` : name]: prop.ref }
	}

	if (prop.type === 'embedded') {
		return Object.assign(
			{},
			...Object.entries(prop.value).map(([key, value]) =>
				extractRefsFromProp(key, value, path ? `${path}.${name}` : name)),
		)
	}

	return {}
}

export function extractRefsFromNode({ data }: Node<Model>): Record<string, string> {
	return Object.assign({}, ...Object.entries(data.props).map(([name, def]) => extractRefsFromProp(name, def)))
}

export function linkRefs(nodes: Node<Model>[]) {
	return nodes.flatMap((node) => {
		const refs = extractRefsFromNode(node)

		const {
			data: { name },
			id,
		} = node

		return Object.entries(refs).map(([path, foreign]) => ({
			id: `${name}::${path} => ${foreign}`,
			label: `${name} -> ${foreign}`,
			source: id,
			target: foreign,
			type: 'smoothstep',
			sourceHandle: path,
			targetHandle: foreign,
		}))
	})
}
