import './App.scss';
import React from 'react';

function NumberButton({textId, value, clickListener}) {
    const emit = () => clickListener(value);
    return (
        <button className="number" id={ textId } onClick={ emit } >{ value }</button>
    );
}

function OpButton({textId, value, clickListener}) {
    const emit = () => clickListener(value);
    return (
        <button className="operaton" id={ textId } onClick={ emit } >{ value }</button>
    );
}

class App extends React.Component {
    render() {
        const numbers = [
            'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
        ].map((textId, value) => (
            <NumberButton key={value} textId={textId} value={value + 1} clickListener={null} />
        ));
        return (
            <div className="App">
                <header id="calc-container">
                    { numbers.slice(6 ) }
                    <OpButton value="-" textId="minus" clickListener={null} />
                    { numbers.slice(3, 6) }
                    <OpButton value="+" textId="plus" clickListener={null} />
                    { numbers.slice(0, 3) }
                </header>
            </div>
        );
    }
}

export default App;
