import { FC }         from 'react'
import { useMemo }    from 'react'

import { styled }     from '@mui/joy'
import { useTheme }   from '@mui/joy'
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

const ReactFlowStyled = styled(ReactFlow)(({ theme }) => ({
  '.react-flow__edge-path': {
    stroke: theme.vars.palette.neutral.solidBg,
  },

  '.react-flow__edge-textbg': {
    fill: theme.vars.palette.background.surface,
  },

  '.react-flow__edge-text': {
    fill: theme.vars.palette.text.primary,
  },
}))

const MiniMapStyled = styled(MiniMap)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.surface,

  '.react-flow__minimap-mask': {
    fill: theme.vars.palette.background.level1,
    opacity: 0.9,
  },
}))

const ControlsStyled = styled(Controls)(({ theme }) => ({
  borderRadius: '6px',

  button: {
    backgroundColor: theme.vars.palette.background.level2,
    borderBottom: 0,

    '&:hover': {
      backgroundColor: theme.vars.palette.background.level3,
    },

    path: {
      fill: theme.vars.palette.text.primary,
    },
  },
}))

export const App: FC = () => {
  const theme = useTheme()
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
        dragHandle: '.drag-handle',
        position: model.position ?? { x: Math.floor(idx % square!) * 700, y: Math.floor(idx / square!) * 500 },
      })),
    [data, square],
  )

  const edges = useMemo(() => (nodes ? linkRefs(nodes) : undefined), [nodes])

  if (status === 'pending') {
    return 'Loading...'
  }

  return (
    <ReactFlowStyled defaultNodes={nodes} defaultEdges={edges} fitView nodeTypes={nodeTypes}>
      <MiniMapStyled
        style={{
          height: 120,
        }}
        zoomable
        pannable
      />
      <ControlsStyled />
      <Background color={theme.vars.palette.neutral.outlinedBorder} gap={16} />
    </ReactFlowStyled>
  )
}
