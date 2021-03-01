import styled from 'styled-components'

const transSpeed = "250ms cubic-bezier(0.11, 0.06, 0, 0.98)"
const transSpeedComp = "200ms"

export const DDownCont = styled.div`
    width: 100%;
    height: 100%;
    position: relative;

    & * {
        user-select: none;
    }
`

export const DDownTopShadow = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({ height }) => height};
    box-shadow: 0 4px 20px 1px #00000022;
    background-color: ${({ theme }) => theme.color.light};
`

export const DDownList = styled.div`
    transition: transform ${transSpeed}, opacity ${transSpeedComp};
    transform: translateY(${({ extraMargin }) => extraMargin}px);
    padding-bottom: ${({ extraMargin }) => extraMargin}px;
    opacity: 1;
    width: 100%;
`

export const DDownListItem = styled.p`
    font-weight: bold;
    color: ${({ theme }) => theme.color.fnt_sec};
`

export const DDownListItemCont = styled.div`
    position: relative;
    padding: 0 20px;
    height: ${({ itemWidth }) => itemWidth + "px"};
    display: flex;
    align-items: center;
    cursor: pointer;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: calc(100% - 20px);

        ${({ isLast, theme }) => !isLast && `
            border-bottom: 1px solid ${theme.color.grey};
        `}
    }

    ${({ isActive, theme }) => isActive ? `
        margin: 0 10px;
        padding: 0 10px;
        border-radius: ${theme.border.radius};
        background-color: ${theme.color.ter};

        p {
          color: ${theme.color.fnt_pri};  
        }
    `: ` 
        &:hover {
            background-color: #F3F3F3;

            &::after {
                display: none;
            }
        }
    `
    }
`

export const DDownHeaderCont = styled.div`
    display: flex;
    position: relative;
    padding: 0 20px;
    height: 100%;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
`

export const DDownPlaceholder = styled.p`
    color: ${({ theme }) => theme.color.fnt_place};
    font-weight: bold;
`

export const DDownValue = styled(DDownPlaceholder)`
    color: ${({ theme }) => theme.color.fnt_sec};
`

export const DDownListCont = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    transition: height ${transSpeed};
    height: ${({ isOpen, maxHeight }) => isOpen ? maxHeight + "px" : "100%"};

    background-color: ${({ theme }) => theme.color.light};
    border-radius: ${({ theme }) => theme.border.radius};
    overflow: hidden;

    ${({ isOpen }) => !isOpen && `
        ${DDownTopShadow} {
            transition: box-shadow ${transSpeedComp};
            box-shadow: 0 4px 20px 1px #00000000;
        }

        ${DDownList} {
            transform: translateY(-60px);
            opacity: 0;
        }
    `}
    
`