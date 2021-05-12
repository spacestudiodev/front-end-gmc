import styled from 'styled-components'

export const BoxICCont = styled.div`
    width: 100%;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    .boxItem {
        ${({ dtype }) => dtype === "horizontal" ? `
            display: flex;
            width: 100%;
            height: 252px;
        ` : `
            width: 320px;
            height: 450px;
        `}
        
        padding: 15px;
        border-radius: 15px;
        transition: background-color 300ms;

        :hover {
            background-color: #4F2D5A;
        }

        #imageCont {
            #image {
                img {
                    ${({ dtype }) => dtype === "horizontal" ? `
                        width: 360px;
                        height: 220px;
                    ` : `
                        width: 290px;
                        height: 350px;
                    `}

                    border-radius: 15px;
                    object-fit: cover;
                }
            }
        }

        #content {
            position: relative;

            ${({ dtype }) => dtype === "horizontal" ? `
                margin-left: 40px;
            `: `
                .nextButton{
                    transform: none;
                    left: auto;
                    right: 0;
                    top: 0;
                }
            `}
            
            #title {
                ${({ dtype }) => dtype === "horizontal" ? `
                    margin-top: 10px;
                    font-size: 20px;
                    text-transform: uppercase;
                    span {
                        margin-left: 4px;
                    }
                ` : `
                    margin-top: 15px;
                    font-size: 14px;
                    text-transform: capitalize;
                    font-weight: 400;
                    span {
                        margin-top: 3px;
                        display: block;
                    }
                `}

                color: white;
            }

            #description {
                margin-top: 30px;
                color: white;
                font-size: 13px;
                line-height: 1.6;
                width: 80%;
            }
        }
    }
`