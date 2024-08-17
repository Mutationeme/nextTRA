import React from "react";
import textLang from "../../../helpers/languages/zh_tw.json";
import "./Footer.css";

function Footer(porps) {
    return (
        <div id="footer">
            {textLang.Source_text}: {textLang.Source_platform}
        </div>
    );
}

export default Footer;