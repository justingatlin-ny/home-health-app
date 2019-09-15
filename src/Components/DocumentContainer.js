import React from "react";
import styled from "styled-components";
import requiredDocuments from "../Utils/requiredDocuments";
import { FieldSet } from './styled';
import { replaceAll } from '../Utils';

const File = ({ category, file, idx }) => {
    const vettedFile = replaceAll('_', file);
    return (
        <React.Fragment>
            <label>{vettedFile}</label>
            <input type="file" name={`${category}-${file}`}></input>
        </React.Fragment>
    );
}

const DocumentList = ({ category, handleChange, docArr = [] }) => {
    const obj = docArr.reduce((acc, file, idx) => {
        const random = Math.floor(Math.random() * 1000);
        const key = `section-${idx}-${random}`;
        acc.push(
            <div key={key}>
                <File category={category} file={file} idx={idx} />
            </div>
        );
        return acc;
    }, []);
    
    return obj;
}

const Group = ({ category, docArr, handleChange }) => {
    const vettedCategory = category.toUpperCase();
    return (
        <FieldSet>
            <legend>{vettedCategory}</legend>
            <DocumentList category={category} docArr={docArr} handleChange={handleChange} />
        </FieldSet>
    );
}

class DocumentContainer extends React.Component {
    
    render() {
        const { handleChange } = this.props;
        return Object.entries(requiredDocuments.documents).reduce((acc, item, idx) => {
            const category = item[0];
            const docArr = item[1];
            const random = Math.floor(Math.random() * 1000);
            const key = `group-${idx}-${random}`;
            acc.push(<Group key={key} handleChange={handleChange} category={category} docArr={docArr} />);
            return acc;
        }, []);
    }
}

export default DocumentContainer;