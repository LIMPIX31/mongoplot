import { FC }         from 'react'
import { useMemo }    from 'react'

import { useQuery }   from '@tanstack/react-query'
import { useParams }  from 'react-router-dom'
import { Background } from 'reactflow'
import { Controls }   from 'reactflow'
import { MiniMap }    from 'reactflow'
import { ReactFlow }  from 'reactflow'
import { linkRefs }   from 'utils/link-refs.js'

import { SchemaNode } from 'flow/schema-node/index.js'

const nodeTypes = {
  shema: SchemaNode,
}

export const App: FC = () => {
  const { uri } = useParams()

  const { data, status } = useQuery({
    queryKey: ['mongoplot'],
    queryFn: () => fetch(uri!).then((res) => res.json()),
  })

  const square = useMemo(() => (data ? Math.sqrt(data.length) : undefined), [data])

  const nodes = useMemo(
    () =>
      data?.map((model: any, idx: number) => ({
        id: model.name,
        type: 'shema',
        data: model,
        position: { x: Math.floor(idx % square!) * 700, y: Math.floor(idx / square!) * 500 },
      })),
    [data, square],
  )

  const edges = useMemo(() => (nodes ? linkRefs(nodes) : undefined), [nodes])

  if (status === 'pending') {
    return 'Loading...'
  }

  return (
    <ReactFlow defaultNodes={nodes} defaultEdges={edges} fitView snapToGrid snapGrid={[16, 16]} nodeTypes={nodeTypes}>
      <MiniMap
        style={{
          height: 120,
        }}
        zoomable
        pannable
      />
      <Controls />
      <Background color='#aaa' gap={16} />
    </ReactFlow>
  )
}
