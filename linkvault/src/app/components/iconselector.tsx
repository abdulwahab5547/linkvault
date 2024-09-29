import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TextField, Grid, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';

interface IconSelectorProps {
  onSelectIcon: (iconName: string) => void;
  open: boolean;
  onClose: () => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ onSelectIcon, open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const [Icons, setIcons] = useState<Record<string, React.ComponentType>>({});

  useEffect(() => {
    import('@mui/icons-material').then((module) => {
      const { default: _, ...iconComponents } = module;
      setIcons(iconComponents);
      const iconNames = Object.keys(iconComponents);
      setFilteredIcons(iconNames);
    });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Object.keys(Icons).filter(key => 
      key.toLowerCase().includes(term) && key !== 'default'
    );
    setFilteredIcons(filtered);
  };

  const handleIconSelect = (iconName: string) => {
    onSelectIcon(iconName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select an Icon</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={handleSearch}
          margin="normal"
        />
        <Grid container spacing={2}>
          {filteredIcons.map((iconName) => {
            const IconComponent = Icons[iconName];
            return IconComponent ? (
              <Grid item key={iconName}>
                <IconButton onClick={() => handleIconSelect(iconName)}>
                  <IconComponent />
                </IconButton>
              </Grid>
            ) : null;
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default IconSelector;
