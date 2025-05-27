import MusicMenu from './MusicMenu';
import AllSongs from './AllSongs';
import Artists from './Artists';
import Albums from './Albums';

function Music(props) {
  const {musicMenu, allsongs, artists, albums} = props.display;
  const activeItemInMenu = props.activeItemInMenu;
  
  return (
    <div className="display">
      {
        musicMenu ? (
          <MusicMenu activeItemInMenu={activeItemInMenu}/>
        ) : allsongs ? (
          <AllSongs />
        ) : artists ? (
          <Artists />
        ) : albums ? (
          <Albums />
        ) : null
      }
    </div>
  );
}
  
export default Music;
  