import type { IFieldProps } from './Fields'
import { FieldContainer, ErrorMessage } from './elements'
import ReactFlagsSelect from 'react-flags-select'
import { Flex } from 'rebass/styled-components'

export const FlagSelectField = ({ input, meta }: IFieldProps) => (
  <Flex p={0} flexWrap="wrap">
    <FieldContainer invalid={meta.error && meta.touched}>
      <ReactFlagsSelect
        searchable={true}
        selected={'input.value'}
        onSelect={v => {
          input.onChange(v)
          input.onBlur()
        }}
      />
    </FieldContainer>
    {meta.error && meta.touched && (
      <ErrorMessage style={{ bottom: '-10px' }}>{meta.error}</ErrorMessage>
    )}
  </Flex>
)
