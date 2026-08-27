import React, {useState} from 'react';
import {useSiteTheme} from '@site/src/theme/ThemeProvider';

function SpiderScene() {
  const [isHanging, setIsHanging] = useState(true);
  const [isLaunched, setIsLaunched] = useState(false);

  const handleLaunch = () => {
    setIsHanging(false);
    setIsLaunched(true);
    window.setTimeout(() => {
      setIsLaunched(false);
      setIsHanging(true);
    }, 800);
  };

  return (
    <div
      className={`theme-character theme-character--spider ${isHanging ? 'is-hanging' : 'is-dropped'}`}
      aria-label="Spider-Man scene"
    >
      <div className="theme-character__web" />
      <div className="theme-character__silk-line" />
      <div className={`theme-character__spider ${isLaunched ? 'is-launched' : ''}`}>
        <span className="theme-character__spider-body" />
        <span className="theme-character__spider-eye theme-character__spider-eye--left" />
        <span className="theme-character__spider-eye theme-character__spider-eye--right" />
        <span className="theme-character__spider-hand theme-character__spider-hand--left" />
        <span className="theme-character__spider-hand theme-character__spider-hand--right" />
      </div>
      <button
        type="button"
        className="theme-character__launch-button"
        onClick={handleLaunch}
      >
        发射蛛丝
      </button>
      <div className="theme-character__quote">“With great power comes great responsibility.”</div>
    </div>
  );
}

function BatmanScene() {
  return (
    <div className="theme-character theme-character--batman" aria-hidden="true">
      <div className="theme-character__bat-signal" />
      <div className="theme-character__bat-wing theme-character__bat-wing--left" />
      <div className="theme-character__bat-wing theme-character__bat-wing--right" />
      <div className="theme-character__bat-crest" />
    </div>
  );
}

function ForestScene() {
  return (
    <div className="theme-character theme-character--forest" aria-hidden="true">
      <div className="theme-character__forest-glow" />
      <div className="theme-character__forest-tree theme-character__forest-tree--left" />
      <div className="theme-character__forest-tree theme-character__forest-tree--mid" />
      <div className="theme-character__forest-tree theme-character__forest-tree--right" />
    </div>
  );
}

function CosmicScene() {
  return (
    <div className="theme-character theme-character--cosmic" aria-hidden="true">
      <div className="theme-character__star theme-character__star--one" />
      <div className="theme-character__star theme-character__star--two" />
      <div className="theme-character__star theme-character__star--three" />
      <div className="theme-character__orbit" />
      <div className="theme-character__ring theme-character__ring--one" />
      <div className="theme-character__ring theme-character__ring--two" />
    </div>
  );
}

function CourtScene() {
  return (
    <div className="theme-character theme-character--court" aria-hidden="true">
      <div className="theme-character__court-halo" />
      <div className="theme-character__court-line theme-character__court-line--one" />
      <div className="theme-character__court-line theme-character__court-line--two" />
      <div className="theme-character__court-ball" />
    </div>
  );
}

function MusicScene() {
  return (
    <div className="theme-character theme-character--music" aria-hidden="true">
      <div className="theme-character__record" />
      <div className="theme-character__record theme-character__record--inner" />
      <div className="theme-character__note theme-character__note--one" />
      <div className="theme-character__note theme-character__note--two" />
      <div className="theme-character__note theme-character__note--three" />
    </div>
  );
}

function LandscapeScene() {
  return (
    <div className="theme-character theme-character--landscape" aria-hidden="true">
      <div className="theme-character__sun" />
      <div className="theme-character__hill theme-character__hill--one" />
      <div className="theme-character__hill theme-character__hill--two" />
      <div className="theme-character__wave" />
    </div>
  );
}

function MinimalScene() {
  return (
    <div className="theme-character theme-character--minimal" aria-hidden="true">
      <div className="theme-character__dot theme-character__dot--one" />
      <div className="theme-character__dot theme-character__dot--two" />
      <div className="theme-character__dot theme-character__dot--three" />
      <div className="theme-character__line" />
    </div>
  );
}

export default function ThemeCharacter() {
  const {theme} = useSiteTheme();
  const id = theme.id || '';

  if (id.includes('spider')) return <SpiderScene />;
  if (id.includes('batman') || id.includes('dark-knight')) return <BatmanScene />;
  if (id.includes('boonie') || id.includes('forest') || id.includes('snow')) return <ForestScene />;
  if (id.includes('genshin') || id.includes('star-rail') || id.includes('arknights')) return <CosmicScene />;
  if (id.includes('lebron') || id.includes('stephen') || id.includes('kobe')) return <CourtScene />;
  if (
    id.includes('michael') ||
    id.includes('janet') ||
    id.includes('dangelo') ||
    id.includes('weeknd') ||
    id.includes('sakamoto') ||
    id.includes('butterfly') ||
    id.includes('erquan')
  ) {
    return <MusicScene />;
  }
  if (id.includes('rain') || id.includes('sunrise') || id.includes('seaside') || id.includes('wilderness')) {
    return <LandscapeScene />;
  }
  if (id.includes('minimal')) return <MinimalScene />;

  return <CosmicScene />;
}