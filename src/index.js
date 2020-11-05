// Reactness
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// Contentful deps
import {init} from 'contentful-ui-extensions-sdk';

// Forma 36 components
import '@contentful/forma-36-react-components/dist/styles.css'
import '@contentful/forma-36-fcss/dist/styles.css'
import './index.css';
import {FieldGroup} from '@contentful/forma-36-react-components'

// Custom components
import Radio from './Radio'

// Create UI Extension component
class ColorSelector extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired,
    };

    detachExternalChangeHandler = null;

    constructor(props) {
        super(props);

        // Check for colors to be defined
        const colors =
            {
                "Field Blue": "#0a46e6",
                "Field Green": "#37816e",
                "Field Orange": "#F29F77",
                "Field Purple": "#B274A7",
                "Field Gray Lighter": "#F0F3F3",
                "Field Gray Light": "#C9CACC",
                "Field Gray": "#6a6a71",
                "Field Gray Darker": "#333336",
                "Field Black": "#0F0F14",
                "Success Green": "#53B59E",
                "Warning Red": "#D44235",
                "Map Brown": "#663300",
                "Map Dark Yellow": "#9a7e0b",
                "Map Light Blue": "#6FB4D6",
                "Map Light Green": "#AAC38A",
                "Map Magenta": "#A7197C",
                "Map Yellow": "#C6AD59",
            };


        // Set initial state
        this.state = {
            colors: colors,
            value: props.sdk.field.getValue(),
        };
    }

    // On mount
    componentDidMount() {
        this.props.sdk.window.startAutoResizer();

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
        this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
            this.onExternalChange
        );
    }

    // On onmount
    componentWillUnmount() {
        if (this.detachExternalChangeHandler) {
            this.detachExternalChangeHandler();
        }
    }

    // Hadle external chages, like from other editors
    onExternalChange = value => {
        this.setState({value});
    };

    // Handle choices in the radio fields
    onChange = (value) => {
        this.setState({value});
        if (value) {
            this.props.sdk.field.setValue(value);
        } else {
            this.props.sdk.field.removeValue();
        }
    };

    // Generate the list of radio fields
    render() {
        return (
            <FieldGroup>
                {Object.entries(this.state.colors).map(([name, color]) => (
                    <Radio
                        key={name}
                        name={name}
                        color={color}
                        checked={this.state.value == name}
                        onClick={this.onChange}
                    />
                ))}
            </FieldGroup>
        )
    }
}

init(sdk => {
    ReactDOM.render(<ColorSelector sdk={sdk}/>, document.getElementById('root'));
});
