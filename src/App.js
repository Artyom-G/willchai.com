import './App.scss';
import { Tabs } from './components/Tabs';
import { WillchaiButton } from './components/WillchaiButton';
import { SocialsButtons } from './components/SocialsButtons';

function App() {
    return (
        <div className="App">
            <div className="overlay"></div>
            <WillchaiButton/>
            <SocialsButtons/>
            <Tabs/>
        </div>
    );
}

export default App;
