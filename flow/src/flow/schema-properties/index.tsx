import { FC, useState } from 'react'
import      { PropsWithChildren } from 'react'

import      { Accordion }         from '@mui/joy'
import      { useTheme }          from '@mui/joy'
import      { AccordionDetails }  from '@mui/joy'
import      { AccordionSummary }  from '@mui/joy'
import      { Box }               from '@mui/joy'
import      { Typography }        from '@mui/joy'
import      { Handle }            from 'reactflow'
import      { Position }          from 'reactflow'
import type { Properties }        from 'types/index.js'
import      { Prop }              from 'types/index.js'

export interface SchemaPropertiesProps {
  props: Properties
}

const ctsx = { fontSize: 'inherit', fontFamily: 'inherit' }

const PropWrapper: FC<PropsWithChildren> = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '0.9rem', position: 'relative' }}>{children}</Box>
)

const Delimiter: FC<{ optional?: boolean }> = ({ optional }) => (
  <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.neutral[500], whiteSpace: 'pre' })}>
    {optional ? ' ?: ' : ' : '}
  </Typography>
)

const RepeatedWrapper: FC<PropsWithChildren<{ repeated?: boolean }>> = ({ children, repeated }) => (
  <>
    {repeated && (
      <Typography
        sx={({ vars }) => ({
          ...ctsx,
          color: vars.palette.neutral[500],
          fontWeight: 700,
          paddingRight: '4px',
        })}
      >
        [
      </Typography>
    )}
    {children}
    {repeated && (
      <Typography
        sx={({ vars }) => ({
          ...ctsx,
          color: vars.palette.neutral[500],
          fontWeight: 700,
          paddingLeft: '4px',
        })}
      >
        ]
      </Typography>
    )}
  </>
)

const RenderType: FC<{ name: string; def: Prop; path: string; inView?: boolean }> = ({ name, def, path, inView }) => {
  const [inViewChild, setInView] = useState(false)
  const theme = useTheme()

  const propName = <Typography sx={{ ...ctsx }}>{name}</Typography>

  if (def.type === 'unknown') {
    return (
      <PropWrapper>
        {propName}

        <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.danger.plainColor })}>
          <Delimiter optional={def.optional} />
          <RepeatedWrapper repeated={def.repeated}>Unknown</RepeatedWrapper>
        </Typography>
      </PropWrapper>
    )
  }

  if (def.type === 'union') {
    const slice = def.value.slice(0, 3)
    const ellipsis = def.value.length > 3

    return (
      <Accordion expanded={inViewChild} onChange={(_, expanded) => setInView(expanded)}>
        <AccordionSummary sx={{ fontWeight: 'normal', '& .MuiAccordionSummary-button': { border: 0 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '0.9rem' }}>
            {propName}
            <Typography sx={({ vars }) => ({ ...ctsx })}>
              <Delimiter optional={def.optional} />
              <RepeatedWrapper repeated={def.repeated}>
                {slice.map((item, idx) => (
                  <>
                    <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.success.plainColor })}>
                      {item}
                    </Typography>
                    {idx < slice.length - 1 && (
                      <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.neutral[400] })}>
                        {' | '}
                      </Typography>
                    )}
                  </>
                ))}
                {ellipsis && (
                  <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.neutral[400] })}> ...</Typography>
                )}
              </RepeatedWrapper>
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <RenderSubProp prop={def} path={path} />
        </AccordionDetails>
      </Accordion>
    )
  }

  if (def.type === 'embedded') {
    return (
      <Accordion>
        <AccordionSummary sx={{ fontWeight: 'normal', '& .MuiAccordionSummary-button': { border: 0 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '0.9rem' }}>
            {propName}
            <Typography sx={({ vars }) => ({ ...ctsx })}>
              <Delimiter optional={def.optional} />
              <RepeatedWrapper repeated={def.repeated}>
                <Typography fontWeight={900} sx={({ vars }) => ({ color: vars.palette.neutral[500] })}>
                  {'{ ... }'}
                </Typography>
              </RepeatedWrapper>
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <RenderSubProp prop={def} path={path} />
        </AccordionDetails>
      </Accordion>
    )
  }

  if (def.type === 'common') {
    return (
      <PropWrapper>
        {propName}
        <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.primary.plainColor })}>
          <Delimiter optional={def.optional} />
          <RepeatedWrapper repeated={def.repeated}>{def.value}</RepeatedWrapper>
        </Typography>
        {def.ref && (
          <Handle
            type='source'
            position={Position.Right}
            id={path}
            hidden
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              right: '-21px',
              borderRadius: '4px',
              background: theme.vars.palette.primary.softColor,
              border: `2px solid ${theme.vars.palette.background.body}`,
            }}
          />
        )}
      </PropWrapper>
    )
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>
}

export const RenderSubProp: FC<{ prop: Prop; path: string }> = ({ prop, path }) => {
  if (prop.type === 'union') {
    return (
      <Box sx={{ padding: '4px 0 4px 16px' }}>
        {prop.value.map((item) => (
          <Typography sx={{ ...ctsx, lineHeight: '1.25rem' }}>
            <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.neutral[400] })}>{'| '}</Typography>
            <Typography sx={({ vars }) => ({ ...ctsx, color: vars.palette.success.plainColor })}>{item}</Typography>
          </Typography>
        ))}
      </Box>
    )
  }

  if (prop.type === 'embedded') {
    return (
      <Box sx={{ padding: '4px 0 4px 16px' }}>
        {Object.entries(prop.value).map(([key, def]) => (
          <RenderType name={key} def={def} path={`${path}.${key}`} />
        ))}
      </Box>
    )
  }
}

export const SchemaProperties: FC<SchemaPropertiesProps> = ({ props }) => (
  <Box sx={({ vars }) => ({ padding: '8px 16px', fontSize: '0.9rem', fontFamily: vars.fontFamily.code })}>
    {Object.entries(props).map(([key, def]) => (
      <RenderType name={key} def={def} path={key} />
    ))}
  </Box>
)
