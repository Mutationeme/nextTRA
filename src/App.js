import React, { useState } from "react";

import TraTab from "./components/TRA/TraTab.js";
import ThsrTab from "./components/THSR/ThsrTab.js";
import { NotifyToast } from "./components/common/NotifyToast/NotifyToast.js";
import Footer from "./components/common/Footer/Footer.js";

import { StatusProvider } from "./context/statusContext.js";

// Languages: zh_tw
import textLang from "./helpers/languages/zh_tw.json";
import { TbTrain } from "react-icons/tb";
import { IoIosTrain } from "react-icons/io";
import "./App.css";

const traTabKey = 0;
const thsrTabKey = 1;

function App() {
    const [tabKey, setTabKey] = useState(0);

    return (
        <div id="absRoot">
            <StatusProvider>
                <div className="app-header">
                    <h1>nextTRA</h1>
                </div>
                <div className="container">
                    <div className="tab-group">
                        <button
                            className={`btn tab-btn tab-btn-left ${tabKey === traTabKey ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTabKey(traTabKey)}
                        >
                            <IoIosTrain color={tabKey === traTabKey ? "white" : "DodgerBlue"} size="18" />
                            &nbsp;{textLang.TRA}
                        </button>
                        <button
                            className={`btn tab-btn tab-btn-right ${tabKey === thsrTabKey ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setTabKey(thsrTabKey)}
                        >
                            <TbTrain color={tabKey === thsrTabKey ? "white" : "orange"} size="18" />
                            &nbsp;{textLang.THSR}
                        </button>
                    </div>

                    <div style={{ display: tabKey === traTabKey ? "block" : "none" }}>
                        <TraTab />
                    </div>
                    <div style={{ display: tabKey === thsrTabKey ? "block" : "none" }}>
                        <ThsrTab />
                    </div>
                </div>
                <NotifyToast />
                <Footer />
            </StatusProvider>
        </div>
    );
}

export default App;