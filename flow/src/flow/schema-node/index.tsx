import { FC }               from 'react'

import { Box }              from '@mui/joy'
import { useTheme }         from '@mui/joy'
import { Typography }       from '@mui/joy'
import { Handle }           from 'reactflow'
import { Position }         from 'reactflow'

import { SchemaProperties } from 'flow/schema-properties/index.js'

export const SchemaNode: FC<any> = ({ id, data }) => {
  const theme = useTheme()

  return (
    <Box
      sx={({ vars }) => ({
        position: 'relative',
        borderRadius: '6px',
        border: `1px solid ${vars.palette.neutral.outlinedBorder}`,
        background: vars.palette.background.surface,
      })}
    >
      <Box>
        <Handle
          type='target'
          position={Position.Top}
          id={data.name}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '4px',
            background: theme.vars.palette.primary.softColor,
            border: `2px solid ${theme.vars.palette.background.body}`,
          }}
        />
        <Typography
          className='drag-handle'
          sx={({ vars }) => ({
            padding: '8px 16px',
            fontSize: '1.25rem',
            borderBottom: `1px solid ${vars.palette.neutral.outlinedBorder}`,
          })}
        >
          {data.name}
        </Typography>
        <SchemaProperties props={data.props} />
      </Box>
    </Box>
  )
}
