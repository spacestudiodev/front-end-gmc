import styled from 'styled-components'

export const Text = styled.p`
    color: ${({ theme, tertiary, secondary }) =>
        tertiary ? theme.color.fnt_ter : secondary ? theme.color.fnt_sec : theme.color.fnt_pri};
    font-weight: ${({ bold }) => bold ? "500" : "normal"};
`

export const TextPlaceholder = styled(Text)`
    color: ${({ theme }) => theme.color.fnt_place};
`

