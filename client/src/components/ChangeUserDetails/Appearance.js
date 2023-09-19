import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import {
    enable as enableDarkMode,
    disable as disableDarkMode,
    auto as followSystemColorScheme,
    setFetchMethod as setFetchMethodForDarkReader,
    exportGeneratedCSS as collectCSS,
    isEnabled as isDarkReaderEnabled
} from 'darkreader';

const AppearanceMode = (Theme) => {
    if (Theme === 'light') {
        localStorage.setItem('dark-mode-enabled', 'false');
        disableDarkMode();
    } else if (Theme === 'dark') {
        localStorage.setItem('dark-mode-enabled', 'true');
        enableDarkMode({
            brightness: 100,
            contrast: 90,
            sepia: 10
        });
    } else if (Theme === 'system') {
        localStorage.setItem('dark-mode-enabled', 'auto');
        followSystemColorScheme();
    }
};

const Appearance = () => {
    const [theme, setTheme] = useState(localStorage.getItem('dark-mode-enabled'));

    useEffect(() => {
        AppearanceMode(theme);
    }, [theme]);

    return (
        <div className="appearance-container">
          <DropdownButton id="dropdown-basic-button" title="Appearance" variant="info">
            <Dropdown.Item
              onClick={() => setTheme('light')}
              className={theme === 'light' ? 'active' : ''}
            >
              Light
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setTheme('dark')}
              className={theme === 'dark' ? 'active' : ''}
            >
              Dark
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setTheme('system')}
              className={theme === 'system' ? 'active' : ''}
            >
              System
            </Dropdown.Item>
          </DropdownButton>
        </div>
      );
};

export default Appearance;