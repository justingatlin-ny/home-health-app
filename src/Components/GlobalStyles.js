import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body, div, p, h1, h2, h3, h4 {
        margin: 0;
        padding: 0;        
    }
    body {
        font-family: monospace, sans-serif;
    }
    label, input {
    }
    label {
        text-transform: capitalize;
    }
    form {
        margin: 25px;
    }
    fieldset {
        margin-top: 35px;
        padding-right: 45px;
        background-color: #dedede;
        legend {
            text-transform: capitalize;
            padding: 10px;
            position: relative;
            bottom: 22.5px;
            border-radius: 5px 5px 0 0;
            background-color: inherit;
            border-style: groove groove none;
            border-color: threedface;
            border-width: 2px;
            h3 {
                letter-spacing: .05em;
            }
        }
        & > h4 {
            margin-left: 25px;
            padding-bottom: 5px;
            border-bottom: 1px solid #bbb;
        }
        div {
            margin: 25px 25px 25px;
            input {
                margin-left: 25px;
                &:hover {
                    cursor: pointer;
                }
            }
        }
        & > div {
            margin-left: 45px;
        }
    }

    .button {
        margin: 25px 0;
    }
    
    fieldset:nth-child(odd) {
        background-color: #ccc;
    }
    .document {
    }
    .person {
        display: inline-block;
    }
    h4 {
        text-transform: capitalize;
        margin-bottom: 5px;
    }
    .filemanager {
        position: relative;
        &[data-complete="true"]:before {
            content: "\\2714";
            position: absolute;
            left: -25px;
            font-size: xx-large;
            color: green;
            top: -11px;
        }
    }
    .checkmark {
        font-size: xx-large;
        color: green;
        vertical-align: middle;
    }
    .instructions {
        margin: 0;
        padding: 0;
        margin-left: 3em;
        color: #444;
        &:before {
            content: '\\2139';
            border: 1px solid;
            border-radius: 40%;
            display: inline-block;
            width: 1.2em;
            height: 1.2em;
            margin-right: .5em;
            text-align: center;

        }
    }
    
`;

export default GlobalStyles;