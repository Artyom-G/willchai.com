import React, { useState } from "react";
import './Tabs.scss';
import { Home } from "../pages/Home";
import { Resume } from "../pages/Resume";
import { CoolStuff } from "../pages/CoolStuff";
import { Contact } from "../pages/Contact";
import { Photography } from "../pages/Photography";

export const Tabs = () => {

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        console.log(index);
        setToggleState(index);
    }

    return ( 
        <div className="container-tabs">
            <div className={toggleState === 1 ? "content active-content" : "content"}>
                <Home/>
            </div>
            <div className={toggleState === 2 ? "content active-content" : "content"}>
                <CoolStuff/>
            </div>
            <div className={toggleState === 3 ? "content active-content" : "content"}>
                <Resume />
            </div>
            <div className={toggleState === 4 ? "content active-content" : "content"}>
                <Contact/>
            </div>
            <div className={toggleState === 5 ? "content active-content" : "content"}>
                <Photography/>
            </div>

            <svg className="sine-wave" width="1440" height="56" viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2_297)">
                    <path d="M0 28L3.6 25.5161L7.2 23.1695L10.8 21.0899L14.4 19.3921L18 18.1699L21.6 17.491L25.2 17.3928L28.8 17.8808L32.4 18.9279L36 20.4764L39.6 22.4406L43.2 24.7121L46.8 27.1652L50.4 29.6645L54 32.0718L57.6 34.254L61.2 36.0907L64.8 37.4803L68.4 38.346L72 38.64L75.6 38.346L79.2 37.4803L82.8 36.0907L86.4 34.254L90 32.0718L93.6 29.6645L97.2 27.1652L100.8 24.7121L104.4 22.4406L108 20.4764L111.6 18.9279L115.2 17.8808L118.8 17.3928L122.4 17.491L126 18.1699L129.6 19.3921L133.2 21.0899L136.8 23.1695L140.4 25.5161L144 28L147.6 30.4839L151.2 32.8305L154.8 34.9101L158.4 36.6079L162 37.8301L165.6 38.509L169.2 38.6072L172.8 38.1192L176.4 37.0721L180 35.5236L183.6 33.5594L187.2 31.2879L190.8 28.8348L194.4 26.3355L198 23.9282L201.6 21.746L205.2 19.9093L208.8 18.5197L212.4 17.654L216 17.36L219.6 17.654L223.2 18.5197L226.8 19.9093L230.4 21.746L234 23.9282L237.6 26.3355L241.2 28.8348L244.8 31.2879L248.4 33.5594L252 35.5236L255.6 37.0721L259.2 38.1192L262.8 38.6072L266.4 38.509L270 37.8301L273.6 36.6079L277.2 34.9101L280.8 32.8305L284.4 30.4839L288 28L291.6 25.5161L295.2 23.1695L298.8 21.0899L302.4 19.3921L306 18.1699L309.6 17.491L313.2 17.3928L316.8 17.8808L320.4 18.9279L324 20.4764L327.6 22.4406L331.2 24.7121L334.8 27.1652L338.4 29.6645L342 32.0718L345.6 34.254L349.2 36.0907L352.8 37.4803L356.4 38.346L360 38.64L363.6 38.346L367.2 37.4803L370.8 36.0907L374.4 34.254L378 32.0718L381.6 29.6645L385.2 27.1652L388.8 24.7121L392.4 22.4406L396 20.4764L399.6 18.9279L403.2 17.8808L406.8 17.3928L410.4 17.491L414 18.1699L417.6 19.3921L421.2 21.0899L424.8 23.1695L428.4 25.5161L432 28L435.6 30.4839L439.2 32.8305L442.8 34.9101L446.4 36.6079L450 37.8301L453.6 38.509L457.2 38.6072L460.8 38.1192L464.4 37.0721L468 35.5236L471.6 33.5594L475.2 31.2879L478.8 28.8348L482.4 26.3355L486 23.9282L489.6 21.746L493.2 19.9093L496.8 18.5197L500.4 17.654L504 17.36L507.6 17.654L511.2 18.5197L514.8 19.9093L518.4 21.746L522 23.9282L525.6 26.3355L529.2 28.8348L532.8 31.2879L536.4 33.5594L540 35.5236L543.6 37.0721L547.2 38.1192L550.8 38.6072L554.4 38.509L558 37.8301L561.6 36.6079L565.2 34.9101L568.8 32.8305L572.4 30.4839L576 28L579.6 25.5161L583.2 23.1695L586.8 21.0899L590.4 19.3921L594 18.1699L597.6 17.491L601.2 17.3928L604.8 17.8808L608.4 18.9279L612 20.4764L615.6 22.4406L619.2 24.7121L622.8 27.1652L626.4 29.6645L630 32.0718L633.6 34.254L637.2 36.0907L640.8 37.4803L644.4 38.346L648 38.64L651.6 38.346L655.2 37.4803L658.8 36.0907L662.4 34.254L666 32.0718L669.6 29.6645L673.2 27.1652L676.8 24.7121L680.4 22.4406L684 20.4764L687.6 18.9279L691.2 17.8808L694.8 17.3928L698.4 17.491L702 18.1699L705.6 19.3921L709.2 21.0899L712.8 23.1695L716.4 25.5161L720 28L723.6 30.4839L727.2 32.8305L730.8 34.9101L734.4 36.6079L738 37.8301L741.6 38.509L745.2 38.6072L748.8 38.1192L752.4 37.0721L756 35.5236L759.6 33.5594L763.2 31.2879L766.8 28.8348L770.4 26.3355L774 23.9282L777.6 21.746L781.2 19.9093L784.8 18.5197L788.4 17.654L792 17.36L795.6 17.654L799.2 18.5197L802.8 19.9093L806.4 21.746L810 23.9282L813.6 26.3355L817.2 28.8348L820.8 31.2879L824.4 33.5594L828 35.5236L831.6 37.0721L835.2 38.1192L838.8 38.6072L842.4 38.509L846 37.8301L849.6 36.6079L853.2 34.9101L856.8 32.8305L860.4 30.4839L864 28L867.6 25.5161L871.2 23.1695L874.8 21.0899L878.4 19.3921L882 18.1699L885.6 17.491L889.2 17.3928L892.8 17.8808L896.4 18.9279L900 20.4764L903.6 22.4406L907.2 24.7121L910.8 27.1652L914.4 29.6645L918 32.0718L921.6 34.254L925.2 36.0907L928.8 37.4803L932.4 38.346L936 38.64L939.6 38.346L943.2 37.4803L946.8 36.0907L950.4 34.254L954 32.0718L957.6 29.6645L961.2 27.1652L964.8 24.7121L968.4 22.4406L972 20.4764L975.6 18.9279L979.2 17.8808L982.8 17.3928L986.4 17.491L990 18.1699L993.6 19.3921L997.2 21.0899L1000.8 23.1695L1004.4 25.5161L1008 28L1011.6 30.4839L1015.2 32.8305L1018.8 34.9101L1022.4 36.6079L1026 37.8301L1029.6 38.509L1033.2 38.6072L1036.8 38.1192L1040.4 37.0721L1044 35.5236L1047.6 33.5594L1051.2 31.2879L1054.8 28.8348L1058.4 26.3355L1062 23.9282L1065.6 21.746L1069.2 19.9093L1072.8 18.5197L1076.4 17.654L1080 17.36L1083.6 17.654L1087.2 18.5197L1090.8 19.9093L1094.4 21.746L1098 23.9282L1101.6 26.3355L1105.2 28.8348L1108.8 31.2879L1112.4 33.5594L1116 35.5236L1119.6 37.0721L1123.2 38.1192L1126.8 38.6072L1130.4 38.509L1134 37.8301L1137.6 36.6079L1141.2 34.9101L1144.8 32.8305L1148.4 30.4839L1152 28L1155.6 25.5161L1159.2 23.1695L1162.8 21.0899L1166.4 19.3921L1170 18.1699L1173.6 17.491L1177.2 17.3928L1180.8 17.8808L1184.4 18.9279L1188 20.4764L1191.6 22.4406L1195.2 24.7121L1198.8 27.1652L1202.4 29.6645L1206 32.0718L1209.6 34.254L1213.2 36.0907L1216.8 37.4803L1220.4 38.346L1224 38.64L1227.6 38.346L1231.2 37.4803L1234.8 36.0907L1238.4 34.254L1242 32.0718L1245.6 29.6645L1249.2 27.1652L1252.8 24.7121L1256.4 22.4406L1260 20.4764L1263.6 18.9279L1267.2 17.8808L1270.8 17.3928L1274.4 17.491L1278 18.1699L1281.6 19.3921L1285.2 21.0899L1288.8 23.1695L1292.4 25.5161L1296 28L1299.6 30.4839L1303.2 32.8305L1306.8 34.9101L1310.4 36.6079L1314 37.8301L1317.6 38.509L1321.2 38.6072L1324.8 38.1192L1328.4 37.0721L1332 35.5236L1335.6 33.5594L1339.2 31.2879L1342.8 28.8348L1346.4 26.3355L1350 23.9282L1353.6 21.746L1357.2 19.9093L1360.8 18.5197L1364.4 17.654L1368 17.36L1371.6 17.654L1375.2 18.5197L1378.8 19.9093L1382.4 21.746L1386 23.9282L1389.6 26.3355L1393.2 28.8348L1396.8 31.2879L1400.4 33.5594L1404 35.5236L1407.6 37.0721L1411.2 38.1192L1414.8 38.6072L1418.4 38.509L1422 37.8301L1425.6 36.6079L1429.2 34.9101L1432.8 32.8305L1436.4 30.4839" stroke="white" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_2_297">
                        <rect width="1440" height="56" fill="white"/>
                    </clipPath>
                </defs>
            </svg>

            <div className="bloc-tabs">
                <div className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>Home</div>
                <div className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>Cool Stuff</div>
                <div className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)}>Resume</div>
                <div className={toggleState === 4 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(4)}>Contact</div>
                <div className={toggleState === 5 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(5)}>Photography</div>
            </div>

        </div>
    );
}