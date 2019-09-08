import React from "react";
import styled from "styled-components";
import requiredDocuments from "../Utils/requiredDocuments";

class DocumentContainer extends React.Component {



    render() {
        console.log(requiredDocuments);
        return Object.entries(requiredDocuments).reduce((acc, item, idx) => {
            const category = item[0];
            const docArr = item[1];
            console.log('people');
            acc.push(category);
            return acc;
        });
    }
}

export default DocumentContainer;