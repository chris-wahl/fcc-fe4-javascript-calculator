import './App.scss';
import React from 'react';

const OPERATORS = ['+', '-', 'x', '/', '--'];

function Button({textId, value, clickListener, className = []}) {
    return (
        <button className={[...className, "calc-button"].join(' ')} id={textId} onClick={clickListener}>{value}</button>
    );
}

function NumberButton({textId, value, clickListener, className = []}) {
    const emit = () => clickListener(value);
    return (
        <Button className={["number", ...className]} textId={textId} value={value} clickListener={emit}/>
    );
}

function OpButton({textId, value, clickListener, className = []}) {
    const emit = (e) => {
        console.log('emit', e);
        clickListener(value);
    };
    const classes = [
        'operations', ...className
    ];
    return (<Button textId={textId} value={value} className={classes} clickListener={emit}/>);
}

function Display({readout, id}) {
    return (<div id={id}>{readout}</div>);
}

class App extends React.Component {
    numbers = [];

    constructor() {
        super();
        this.state = {
            operations: ['0']
        };
        this.addNumber = this.addNumber.bind(this);
        this.addDecimal = this.addDecimal.bind(this);
        this.addOperation = this.addOperation.bind(this);
        this.performCalculation = this.performCalculation.bind(this);

        this.getValues = this.getValues.bind(this);
        this.setValue = this.setValue.bind(this);

        this.numbers = [
            'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
        ].map((textId, value) => (
            <NumberButton key={value} textId={textId} value={value + 1} clickListener={this.addNumber}/>
        ));
    }

    clear() {
        this.setState({
            operations: ['0']
        })
    }

    getValues() {
        const lastValue = this.state.operations[this.state.operations.length - 1];
        return {
            lastValue,
            operations: this.state.operations
        };
    }

    setValue(value) {
        const operations = this.state.operations;
        operations[this.state.operations.length - 1] = value;
        this.setState({operations});
    }

    addNumber(v) {
        console.log('add number', v);

        const {operations, lastValue} = this.getValues();

        if (lastValue === '0') {
            if (v === 0) {
                return;
            }
            v = v.toString();
        } else if (OPERATORS.some(s => lastValue.endsWith(s))) {
            operations.push(v.toString());
            return this.setState({operations});
        } else {
            v = `${lastValue}${v}`;
        }
        this.setValue(v)
        console.log(operations);
    }

    addDecimal() {
        const {operations, lastValue} = this.getValues();
        console.log(operations, lastValue);
        if (lastValue.includes('.')) {
            return;
        } else if (OPERATORS.some(s => lastValue.endsWith(s))) {
            operations.push('0.');
            return this.setState({operations});
        }
        this.setValue(`${lastValue}.`);
    }

    addOperation(v) {
        // TODO: Allow second "minus" sign to make a number negative
        const {operations, lastValue} = this.getValues();
        if (OPERATORS.some(s => lastValue.endsWith(s))) {
            this.setValue(v);
        } else {
            operations.push(v);
            this.setState({operations});
        }
    }

    performCalculation() {

    }

    render() {
        return (
            <div className="App">
                <header id="calc-container">
                    <Display readout={this.state.operations.join('')} id="readout"/>
                    <Display readout={this.state.operations[this.state.operations.length - 1]} id="display"/>
                    <OpButton value="AC" textId="clear" clickListener={this.clear.bind(this)}
                              className={["two-column"]}/>
                    <OpButton value="/" textId="divide" clickListener={this.addOperation}/>
                    <OpButton value="x" textId="multiply" clickListener={this.addOperation}/>
                    {this.numbers.slice(6)}
                    <OpButton value="-" textId="subtract" clickListener={this.addOperation}/>
                    {this.numbers.slice(3, 6)}
                    <OpButton value="+" textId="add" clickListener={this.addOperation}/>
                    {this.numbers.slice(0, 3)}
                    <OpButton value="=" textId="equals" className={["two-row"]}
                              clickListener={this.performCalculation}/>
                    <NumberButton key={10} value={0} className={["two-column"]} textId="zero"
                                  clickListener={this.addNumber}/>
                    <NumberButton key="." value="." textId="decimal" clickListener={this.addDecimal}/>
                </header>
            </div>
        );
    }
}

export default App;
