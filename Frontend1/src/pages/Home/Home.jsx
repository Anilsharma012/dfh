import React from "react";
import "./Home.css";

import FirstPage from "../../components/FirstPage/FirstPage/FirstPage";
import ThirdPage from "../../components/FirstPage/ThirdPage/ThirdPage";

import SecondPage from "../../components/FirstPage/SecondPage/SecondPage";
// import LeadCaptureModal from "../../components/LeadCaptureModal/LeadCaptureModal";
import ForthPage from "../../components/FirstPage/ForthPage/ForthPage";
import FifthPage from "../../components/FirstPage/FifthPage/FifthPage";
import SixthPage from "../../components/FirstPage/SixthPage/SixthPage";
import SeventhPage from "../../components/FirstPage/SeventhPage/SeventhPage";
import Chatbox from "../../components/Chat/Chatbox";



// con

const Home = () => {
 

  return (
    <div>
        <FirstPage/>
        <SecondPage/>
        <ThirdPage/>
        <ForthPage/>
        <FifthPage/>
        <SixthPage/>
        <SeventhPage/>
        {/* <LeadCaptureModal/> */}
        <Chatbox/>
    </div>
  );
};

export default Home;
