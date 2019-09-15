import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body, div, p, h1, h2, h3, h4 {
        margin: 0;
        padding: 0;        
    }
    label, input {
        display: block;
    }
    label {
        text-transform: capitalize;
    }
    fieldset {
        label {
            text-transform: capitalize;
        }
        div {
            margin: 25px 25px 25px;
            input {
                margin-left: 25px;
            }
        }
    }
`;

export default GlobalStyles;