import React, { useEffect } from 'react';

function SideMenu({ activeItemInMenu, menuItems }) {
  // write logic for changing the selected item in the side menu

  return (
    <table id="side-menu">
        <tbody>
        <tr>
            <th className="table-heading">iPod <i className="fas fa-home"></i></th>
        </tr>
        {menuItems.map((item, index) => (
          <tr key={index} data-option={item.toLowerCase()}>
            <td className={`table-item ${activeItemInMenu === index ? 'active' : ''}`}>
              {item}<i className="fas fa-chevron-right"></i>
            </td> 
          </tr>
        ))}
        </tbody>
    </table>
  );
}

export default SideMenu;