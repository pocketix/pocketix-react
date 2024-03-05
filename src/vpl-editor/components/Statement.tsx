import './Statement.css';
import {ReactNode, useState} from "react";
import {Button} from 'primereact/button';

const Statement = (props: {
    error: string,
    icon: string,
    fontWeight?: string,
    title: string,
    isOpen?: boolean,
    bodyPadding?: string,
    backgroundColor?: string,
    color: string,
    openButton?: boolean,
    header: ReactNode,
    body: ReactNode,
    onUp: CallableFunction,
    onDown: CallableFunction,
    onRemove: CallableFunction
}) => {
    const [openButton, setOpenButton] = useState(props.openButton);

    const toggleAccordion = () => {
        setOpenButton(!openButton);
    };

    const preventDefaults = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const up = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
        preventDefaults(e);
        props.onUp();
    };

    const down = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
        preventDefaults(e);
        props.onDown();
    };

    const remove = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
        preventDefaults(e);
        props.onRemove();
    };

    return (
        <div className="accordion" title={props.error ?? ''}>
            <div className={props.error ? "accordion-header error" : "accordion-header"} onClick={toggleAccordion}>
                <div className="accordion-header-left">
                    <i className={`accordion-icon pi ${props.icon}`}></i>
                    <span className="accordion-title" style={{fontWeight: props.fontWeight}}>
                        {props.title}
                    </span>
                    <div className="accordion-header-content">
                        {props.header}
                    </div>
                    <div className="accordion-header-right">
                        <Button className="accordion-button" icon="pi pi-sort-up" onClick={up} style={{
                            backgroundColor: props.backgroundColor,
                            borderColor: props.color,
                            color: props.color
                        }}>
                        </Button>
                        <Button className="accordion-button" icon="pi pi-sort-down" onClick={down} style={{
                            backgroundColor: props.backgroundColor,
                            borderColor: props.color,
                            color: props.color
                        }}>
                        </Button>
                        <Button className="accordion-button" icon="pi pi-times" onClick={remove} style={{
                            backgroundColor: props.backgroundColor,
                            borderColor: props.color,
                            color: props.color
                        }}>
                        </Button>
                        <span className={`accordion-open-icon ${openButton ? 'open' : 'closed'}`}></span>
                    </div>
                </div>
            </div>

            <div className={`accordion-body ${openButton ? "open" : "closed"}`}
                 style={{paddingLeft: `${props.bodyPadding}px`, backgroundColor: `${props.backgroundColor}`}}
            >
                {props.body}
            </div>
        </div>
    );
}

export {Statement};
