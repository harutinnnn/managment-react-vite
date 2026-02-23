import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Sidebar from "@/components/Sidebar";
import {MainHeader} from "@/components/MainHeader";


function App() {
    return (
        <div id={"wrapper"}>

            <Sidebar/>

            <div className={"main-content"}>

                <MainHeader/>

                <div className="content-inner">

                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Routes>

                </div>

            </div>
        </div>
    );
}

export default App;