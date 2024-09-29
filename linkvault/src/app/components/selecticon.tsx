import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faStar, faHeart } from '@fortawesome/free-solid-svg-icons';

const IconGrid: React.FC<{ onIconSelect: (icon: string) => void }> = ({ onIconSelect }) => {
  const icons: Array<{ id: string; icon: IconDefinition }> = [
    { id: 'faLink', icon: faLink },
    { id: 'faStar', icon: faStar },
    { id: 'faHeart', icon: faHeart }
  ];

  return (
    <div className="icon-grid">
      {icons.map((item) => (
        <div key={item.id} onClick={() => onIconSelect(item.id)}>
          <FontAwesomeIcon icon={item.icon} size="2x" />
        </div>
      ))}
    </div>
  );
};

export default IconGrid;