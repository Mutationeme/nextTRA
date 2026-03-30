import React, { useState } from "react";

// Include the bootstrap in html head to reduce the build size
// import "bootstrap/dist/css/bootstrap.min.css";

import TraTab from "./components/TRA/TraTab.js";
import ThsrTab from "./components/THSR/ThsrTab.js";
import { NotifyToast } from "./components/common/NotifyToast/NotifyToast.js";
import Footer from "./components/common/Footer/Footer.js";

import { StatusProvider } from "./context/statusContext.js";

// Languages: zh_tw
import textLang from "./helpers/languages/zh_tw.json";

// Tabler Icons
/*
MIT License

Copyright (c) 2020-2024 Paweł Kuna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import { TbTrain } from "react-icons/tb";


// Ionicons
/*
The MIT License (MIT)

Copyright (c) 2015-present Ionic (http://ionic.io/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
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

                    {tabKey === traTabKey ? <TraTab /> : <ThsrTab />}
                </div>
                <NotifyToast />
                <Footer />
            </StatusProvider>
        </div>
    );
}

export default App;