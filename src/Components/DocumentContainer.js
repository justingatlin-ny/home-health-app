import React from "react";
import requiredDocuments from "../Utils/requiredDocuments";

const random = () => Math.floor(Math.random() * 1000);
const createDashes = (document) => document.replace(/_/g, '-');
const createSpaces = (name) => name.replace(/_/g, ' ');

const handleItem = (obj) => {
    switch (Object.prototype.toString.call(obj)) {
        case "[object Array]":
            return 'array';
        break;
        case '[object Object]':
            return 'object';
        default:
            return undefined;
    }
}

const FileManager = ({ categoryName, document, person, versions, fileList = [] }) => {
    const filePath = `${createDashes(categoryName)}/${createDashes(document)}/${person}/`;
    const isComplete = fileList.includes(filePath.substr(0, filePath.length - 1));
    
    return versions ? versions.reduce((acc, version, idx) => {
        const key = `version-${random()}-${idx}`;
        const filePathExtened = `${filePath}${version}/`;
        const isComplete = fileList.includes(filePathExtened.substr(0, filePathExtened.length - 1));
        acc.push(
            <div key={key} data-complete={isComplete} className={`filemanager ${person} ${document}`}>
                {version ? <label htmlFor={`${person}-${document}`}>{version}</label> : null}
                <input data-path={filePathExtened} type="file" id={`${person}-${document}-${version}`} name={`${categoryName}-${document}-${version}`}></input>
            </div>
        );
        return acc;
    }, []) : (
                <div data-complete={isComplete} className={`filemanager ${person} ${document}`}>
                    <input data-path={filePath} type="file" className="filemanager" id={`${person}-${document}`} name={`${categoryName}-${document}`}></input>
                </div>
            );
}

const PeopleList = ({ document, categoryName, versions, fileList }) => {
    return requiredDocuments.people.reduce((acc, person, idx) => {
        const key = `person-${idx}-${random()}`;
        const firstVersion = versions ? '-' + versions[0] : '';
        acc.push(
            <div key={key} className={`${person} person`}>
                <label htmlFor={`${person}-${document}${firstVersion}`}><h4>{person}</h4></label>
                <FileManager fileList={fileList} versions={versions} person={person} categoryName={categoryName} className={`${createDashes(categoryName)}-${person}`} document={document} />
            </div>
        );
        return acc;
    }, []);
}



const Document = ({ instructions, document, categoryName, versions, fileList }) => {
    return (
        <React.Fragment>
            <h4>{createSpaces(document)}</h4>
            {instructions && <h5 className="instructions">{instructions}</h5> || null}
            <PeopleList fileList={fileList} document={document} categoryName={categoryName} versions={versions} />
        </React.Fragment>
    );
}

const DocumentList = ({ categoryName, fileList, docs }) => {
    return handleItem(docs) === 'array' && docs.reduce((acc, document, idx) => {
        const key = `section-${idx}-${random()}`;
        acc.push(
            <Document key={key} fileList={fileList} className={`${createDashes(document)} document`} document={document} categoryName={categoryName} />
        );
        return acc;
    }, []) || handleItem(docs) === 'object' && Object.entries(docs).reduce((acc, document, idx) => {
        const documentName = document[0];
        const properties = document[1];
        const key = `section-${idx}-${random()}`;
        const versions = handleItem(properties) === 'array' ? properties : null;
        acc.push(
            <Document fileList={fileList} instructions={properties.instructions} key={key} className={`${createDashes(documentName)} document`} document={documentName} categoryName={categoryName} versions={versions} />
        );
        return acc;
    }, []) || [];
}

const Category = ({ categoryName, docs, handleChange, fileList }) => {
    return (
        <fieldset>
            <legend><h3>{createSpaces(categoryName).toUpperCase()}</h3></legend>
            <DocumentList fileList={fileList} categoryName={categoryName} docs={docs} handleChange={handleChange} />
        </fieldset>
    );
}

class DocumentContainer extends React.Component {

    state = {
        fileList: []
    }
    componentDidMount() {
        const fileList = (typeof window != 'undefined') ? window.fileList : [];
        if (fileList.length) {
            this.setState({ fileList })
        }
    }
    
    render() {
        const { handleChange, fileList } = this.props;
        return Object.entries(requiredDocuments.categories).reduce((acc, category, idx) => {
            const categoryName = category[0];
            const docs = category[1];
            const key = `category-${idx}-${random()}`;
            acc.push(<Category fileList={fileList || this.state.fileList} key={key} handleChange={handleChange} categoryName={categoryName} docs={docs} />);
            return acc;
        }, []);
    }
}

export default DocumentContainer;