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
    const emit = () => clickListener(value);
    const classes = [
        'operations', ...className
    ];
    return (<Button textId={textId} value={value} className={classes} clickListener={emit}/>);
}

function Display({readout, id}) {
    return (<div id={id}>{readout}</div>);
}

const initState = {
    value: null,
    operations: ['0']
}

class App extends React.Component {
    numbers = [];

    constructor() {
        super();
        this.addNumber = this.addNumber.bind(this);
        this.addDecimal = this.addDecimal.bind(this);
        this.addOperation = this.addOperation.bind(this);
        this.performCalculation = this.performCalculation.bind(this);
        this.clear = this.clear.bind(this);

        this.getValues = this.getValues.bind(this);
        this.setValue = this.setValue.bind(this);

        this.numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].map(
            (textId, value) =>
                (<NumberButton key={value.toString()} textId={textId} value={(value + 1).toString()}
                               clickListener={this.addNumber}/>)
        );
        this.state = JSON.parse(JSON.stringify(initState));
        this.clear();
    }

    clear() {
        this.setState(JSON.parse(JSON.stringify(initState)))
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
        if (this.state.value !== null) {
            this.clear();
            return setTimeout(() => this.addNumber(v));
        }

        const {operations, lastValue} = this.getValues();

        if (operations.length === 1) {
            // Only one thing in the queue.
            console.log('operations', operations);
            if (lastValue === '0') {
                // First entry is "init'd" - replace it.
                return this.setValue(v);
            } else if (lastValue === '-') {
                // First entry is a negation operation.  Store the negated number.
                return this.setValue(`-${v}`);
            }
            // First number is numeric.  Append the next digit.
            return this.setValue(`${lastValue}${v}`);
        }

        if (OPERATORS.some(s => lastValue.endsWith(s))) {
            // Previous value was an operation.  Check if it's a negation operation (i.e "+-", "--", "/-", or "*-")
            if (lastValue.length > 1) {
                // Operation is a negation operation.  Remove the extra minus sign from the operation and replace it.
                // Use it to set the input number negative
                v = `-${v}`
                this.setValue(lastValue[0]);
            }
            // Push the new numeric value into the array and set the state.
            operations.push(v);
            return this.setState({operations});
        } else {
            // Append the number.
            if (lastValue === '0') {
                return this.setValue(v);
            }
            v = `${lastValue}${v}`;
            this.setValue(v)
        }
    }

    addDecimal() {
        if (this.state.value !== null) {
            this.setState({
                value: null,
                operations: [this.state.value.toString()]
            })
            return setTimeout(() => {
                this.addDecimal();
            });
        }


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
        if (this.state.value !== null) {
            this.setState({
                value: null,
                operations: [this.state.value.toString()]
            })
            return setTimeout(() => this.addOperation(v));
        }
        const {operations, lastValue} = this.getValues();

        //
        if (operations.length === 1 && (lastValue === '0' || lastValue === '-')) {
            if (v !== '-') {
                // Init state and not trying to negate the value.  Don't do anything.
                return;
            }
            // Init state and trying to start out with a negative number.  Set it as the state.
            return this.setValue('-');
        }

        // most recent value is an operator
        if (OPERATORS.some(s => lastValue.endsWith(s))) {
            if (v === '-') {
                if (lastValue.length === 1) {
                    // Setting the following number to negative.
                    return this.setValue(`${lastValue}-`);
                } else if (lastValue.length === 2) {
                    // Just keep on hitting '-'... do nothing. It's already set.
                    return;
                }
            }
            // Replace the current operation.
            this.setValue(v);
        } else {
            // Most recent value is a number.  Push the new operation.
            operations.push(v);
            this.setState({operations});
        }
    }

    performCalculation() {
        if (this.state.value !== null) {
            return;
        }
        const operations = this.state.operations;

        let acc = parseFloat(operations[0]);

        for (let i = 1; i < operations.length - 1; i += 2) {
            const operation = operations[i];
            const nextValue = parseFloat(operations[i + 1]);
            switch (operation) {
                case '+':
                    acc += nextValue
                    break;
                case '-':
                    acc -= nextValue;
                    break;
                case 'x':
                    acc *= nextValue;
                    break;
                case '/':
                    acc /= nextValue;
                    break;
                default:
            }
        }
        operations.push(`=${acc}`);
        this.setState({
            value: acc,
            operations
        });
    }

    render() {
        return (
            <div className="App">
                <header id="calc-container">
                    <Display readout={this.state.operations.join(' ')} id="readout"/>
                    <Display readout={this.state.value ?? this.state.operations[this.state.operations.length - 1]}
                             id="display"/>
                    <OpButton value="AC" textId="clear" clickListener={this.clear}
                              className={["two-column", "ac-button"]}/>
                    <OpButton value="/" textId="divide" clickListener={this.addOperation}/>
                    <OpButton value="x" textId="multiply" clickListener={this.addOperation}/>
                    {this.numbers.slice(6)}
                    <OpButton value="-" textId="subtract" clickListener={this.addOperation}/>
                    {this.numbers.slice(3, 6)}
                    <OpButton value="+" textId="add" clickListener={this.addOperation}/>
                    {this.numbers.slice(0, 3)}
                    <OpButton value="=" textId="equals" className={["two-row", "equals-button"]}
                              clickListener={this.performCalculation}/>
                    <NumberButton key={10} value={'0'} className={["two-column"]} textId="zero"
                                  clickListener={this.addNumber}/>
                    <NumberButton key="." value="." textId="decimal" clickListener={this.addDecimal}/>
                </header>
            </div>
        );
    }
}

export default App;
