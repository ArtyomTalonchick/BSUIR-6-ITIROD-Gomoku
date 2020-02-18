import React from 'react';

import './Form.scss';

export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: JSON.parse(JSON.stringify(this.props.fields))
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fields !== this.props.fields) {
            this.setState({fields: JSON.parse(JSON.stringify(this.props.fields))});
        }
    }

    onChange = event => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const newField = {...this.state.fields[fieldName], value};
        const newFields = {...JSON.parse(JSON.stringify(this.state.fields)), [fieldName]: newField};
        this.setState({fields: newFields});
    };

    onSubmit = event => {
        event.preventDefault();
        this.props.onSubmit && this.props.onSubmit({...this.state.fields});
    };

    render() {
        const fields = this.state.fields;
        return (
            <div className='form-container'>
                {this.props.title && (
                    <>
                        <h2>{this.props.title}</h2>
                        <hr/>
                    </>
                )}
                <form className='form' onSubmit={this.onSubmit}>
                    {fields && Object.entries(fields).map(([fieldName, {label, value, attributes}]) => (
                        <label key={fieldName}>
                        <span>
                            {label}
                        </span>
                            <input
                                {...attributes}
                                disabled={this.props.disabled}
                                onChange={this.onChange}
                                value={value || ''}
                                name={fieldName}
                                placeholder={`${label}...`}
                            />
                        </label>
                    ))}
                    {!this.props.disabled &&
                    <div className='controls'>
                        {this.props.additionalControl}
                        <button
                            type='submit'
                            className={!this.props.additionalControl ? 'single-control' : ''}
                        >
                            {this.props.submitText || 'Submit'}
                        </button>
                    </div>
                    }
                </form>
            </div>
        );
    }
}
