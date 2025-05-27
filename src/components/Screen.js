import React from 'react';
import './css/screen.css';
import SideMenu from './SideMenu';
import MusicMenu from './MusicMenu';
import Music from './Music';
import Games from './Games';
import Settings from './Settings';
import Coverflow from './Coverflow';

class Screen extends React.Component {

  // Display the sidemenu, coverflow, games, Music etc here
  render() {
    const { display, activeItemInMenu, menuItems, musicMenuItems } = this.props;

    return (
      <div id="screen">
        <div id="top-bar">
          <div id="battery">
            <i className="fas fa-battery-three-quarters"></i>
          </div>
        </div>
        
        <div className="screen-content">
          {display.menu && (
            <SideMenu 
              activeItemInMenu={activeItemInMenu}
              menuItems={menuItems}
            />
          )}
          
          {display.music && (
            <Music 
              display={display}
              activeItemInMenu={activeItemInMenu}
            />
          )}
          
          {display.games && <Games />}
          
          {display.settings && <Settings />}
          
          {display.coverflow && <Coverflow />}
        </div>
      </div>
    );
  }
}

export default Screen;