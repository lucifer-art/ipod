import React, { useEffect } from 'react';

function MusicMenu({ activeItemInMenu }) {
    const musicMenuItems = ['All Songs', 'Artists', 'Albums'];

    return (
      <table id="music-menu">
        <tbody>
        <tr>
            <th className="table-heading">Music <i className="fas fa-music"></i></th>
        </tr>
        {musicMenuItems.map((item, index) => (
          <tr key={index} data-option={item.toLowerCase().replace(' ', '')}>
            <td className={`table-item ${activeItemInMenu === index ? 'active' : ''}`}>
              {item}<i className="fas fa-chevron-right"></i>
            </td> 
          </tr>
        ))}
        </tbody>
    </table>
    );
  }
  
  export default MusicMenu;
  