import { IoSettingsSharp, IoSettingsOutline } from "react-icons/io5";
import { useContext, useState } from "react";
import "./styles.css";
import { GlobalContext } from "../../context";


export default function SettingButton() {
    const [isHovered, setIsHovered] = useState(false);
    const { showSettings, setShowSettings } = useContext(GlobalContext);
    const iconSize = "26";
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    function handleSettingClick() {
        console.log("Setting button clicked");
        toggleSettings();
    }

    return (<div className='settings'>
        {isHovered ? (
            <IoSettingsOutline
                cursor={"pointer"}
                size={iconSize}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleSettingClick}
            />
        ) : (
            <IoSettingsSharp
                cursor={"pointer"}
                size={iconSize}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleSettingClick}
            />
        )}
    </div>)
};