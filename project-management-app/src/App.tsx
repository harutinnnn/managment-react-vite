import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Sidebar from "@/components/Sidebar";
import {MainHeader} from "@/components/MainHeader";
import {useState} from "react";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Members from "@/pages/Members";


function App() {

    const [minMaxSidebar, setMinMaxSidebar] = useState<boolean>(false);

    return (
        <div id={"wrapper"} className={(minMaxSidebar ? "minimised-sidebar" : "")}>

            <Sidebar/>
            <div></div>

            <div className={"main-content"}>

                <MainHeader minMaxSidebar={() => {

                    setMinMaxSidebar(prev => !prev);
                }}/>

                <div className="content-inner">

                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/projects" element={<Projects/>}/>
                        <Route path="/tasks" element={<Tasks/>}/>
                        <Route path="/members" element={<Members/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Routes>

                </div>

            </div>
        </div>
    );
}

export default App;