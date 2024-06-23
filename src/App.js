import './App.scss';
import { Tabs } from './components/Tabs';
import { WillchaiButton } from './components/WillchaiButton';

function App() {
    return (
        <div className="App">
            <div className="overlay"></div>
            <WillchaiButton/>
            <Tabs/>
        </div>
    );
}

export default App;
