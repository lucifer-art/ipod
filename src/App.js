import React from 'react';
import './App.css';
import Screen from './components/Screen';
import Controls from './components/Controls';
import ZingTouch from 'zingtouch';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // Current active screen
      currentScreen: 'menu', // menu, music, games, settings, coverflow
      
      // Menu navigation
      activeItemInMenu: 0, // Index of active item in current menu
      
      // Display states for different screens
      display: {
        menu: true,
        music: false,
        games: false,
        settings: false,
        coverflow: false,
        
        // Music sub-menu states
        musicMenu: true,
        allSongs: false,
        artists: false,
        albums: false
      },
      
      // Menu items
      menuItems: ['Coverflow', 'Music', 'Games', 'Settings'],
      musicMenuItems: ['All Songs', 'Artists', 'Albums']
    };
  }

  componentDidMount() {
    // Initialize circular wheel navigation
    this.initializeWheelNavigation();
  }

  initializeWheelNavigation = () => {
    const wheel = document.getElementById('wheel');
    if (!wheel) return;

    let isMouseDown = false;
    let lastAngle = 0;
    let rotationBuffer = 0;
    const sensitivity = 30; // Degrees needed to trigger navigation

    const getAngle = (e, wheel) => {
      const rect = wheel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      isMouseDown = true;
      lastAngle = getAngle(e, wheel);
      rotationBuffer = 0;
      wheel.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown) return;
      e.preventDefault();

      const currentAngle = getAngle(e, wheel);
      let angleDiff = currentAngle - lastAngle;

      // Handle angle wraparound (crossing from -180 to 180 degrees)
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      rotationBuffer += angleDiff;

      // Check if we've rotated enough to trigger navigation
      if (Math.abs(rotationBuffer) >= sensitivity) {
        const direction = rotationBuffer > 0 ? 1 : -1;
        this.handleWheelNavigation(direction);
        rotationBuffer = 0; // Reset buffer after navigation
      }

      lastAngle = currentAngle;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      rotationBuffer = 0;
      wheel.style.cursor = 'grab';
    };

    // Add event listeners
    wheel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Also try ZingTouch as fallback for touch devices
    try {
      const activeRegion = new ZingTouch.Region(wheel);
      const rotateGesture = new ZingTouch.Rotate({
        threshold: 0
      });
      
      activeRegion.bind(wheel, rotateGesture, (e) => {
        const rotation = e.detail.distanceFromOrigin;
        if (Math.abs(rotation) > 15) {
          this.handleWheelNavigation(rotation > 0 ? 1 : -1);
        }
      });
    } catch (error) {
      console.log('ZingTouch not available, using mouse events only');
    }

    // Set initial cursor
    wheel.style.cursor = 'grab';
  };

  // Handle wheel navigation direction
  handleWheelNavigation = (direction) => {
    const { currentScreen, activeItemInMenu, menuItems, musicMenuItems } = this.state;
    
    if (currentScreen === 'menu') {
      // Navigate main menu
      let newIndex;
      if (direction > 0) {
        newIndex = (activeItemInMenu + 1) % menuItems.length;
      } else {
        newIndex = activeItemInMenu === 0 ? menuItems.length - 1 : activeItemInMenu - 1;
      }
      this.setState({ activeItemInMenu: newIndex });
    } else if (currentScreen === 'music' && this.state.display.musicMenu) {
      // Navigate music sub-menu
      let newIndex;
      if (direction > 0) {
        newIndex = (activeItemInMenu + 1) % musicMenuItems.length;
      } else {
        newIndex = activeItemInMenu === 0 ? musicMenuItems.length - 1 : activeItemInMenu - 1;
      }
      this.setState({ activeItemInMenu: newIndex });
    }
  };

  // If ok button is clicked, open the selected component
  handleOkClick = () => {
    const { currentScreen, activeItemInMenu, menuItems, musicMenuItems, display } = this.state;
    
    if (currentScreen === 'menu') {
      // Main menu OK click
      const selectedItem = menuItems[activeItemInMenu].toLowerCase();
      
      if (selectedItem === 'music') {
        this.setState({
          currentScreen: 'music',
          activeItemInMenu: 0,
          display: {
            ...this.resetDisplay(),
            music: true,
            musicMenu: true
          }
        });
      } else {
        // For other menu items (games, settings, coverflow)
        this.setState({
          currentScreen: selectedItem,
          display: {
            ...this.resetDisplay(),
            [selectedItem]: true
          }
        });
      }
    } else if (currentScreen === 'music' && display.musicMenu) {
      // Music sub-menu OK click
      const selectedMusicItem = musicMenuItems[activeItemInMenu].toLowerCase().replace(' ', '');
      
      this.setState({
        display: {
          ...this.resetDisplay(),
          music: true,
          musicMenu: false,
          [selectedMusicItem]: true
        }
      });
    }
  };

  // If menu button is clicked, go back to the menu screen
  handleMenuClick = () => {
    const { currentScreen, display } = this.state;
    
    if (currentScreen === 'music' && !display.musicMenu) {
      // If in music sub-screen, go back to music menu
      this.setState({
        activeItemInMenu: 0,
        display: {
          ...this.resetDisplay(),
          music: true,
          musicMenu: true
        }
      });
    } else if (currentScreen !== 'menu') {
      // Go back to main menu
      this.setState({
        currentScreen: 'menu',
        activeItemInMenu: 0,
        display: {
          ...this.resetDisplay(),
          menu: true
        }
      });
    }
  };

  // Helper function to reset all display states
  resetDisplay = () => ({
    menu: false,
    music: false,
    games: false,
    settings: false,
    coverflow: false,
    musicMenu: false,
    allsongs: false,
    artists: false,
    albums: false
  });

  render() {
    return (
      <div id="iPod-app">
        <Screen 
          display={this.state.display}
          currentScreen={this.state.currentScreen}
          activeItemInMenu={this.state.activeItemInMenu}
          menuItems={this.state.menuItems}
          musicMenuItems={this.state.musicMenuItems}
        />
        <Controls 
          onOkClick={this.handleOkClick}
          onMenuClick={this.handleMenuClick}
        />
      </div>
    );
  }
}

export default App;