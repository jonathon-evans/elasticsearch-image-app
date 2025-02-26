import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FotografenFilterProps {
  selectedFotografen: string;
  fotografenList: string[];
  onFotografenChange: (fotografen: string) => void;
}

const FotografenFilter: React.FC<FotografenFilterProps> = ({
  selectedFotografen,
  fotografenList,
  onFotografenChange,
}) => {
  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel id="fotografen-label">Fotografen</InputLabel>
      <Select
        labelId="fotografen-label"
        value={selectedFotografen}
        onChange={(e) => onFotografenChange(e.target.value as string)}
        label="Fotografen"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {fotografenList.map((fotografen) => (
          <MenuItem key={fotografen} value={fotografen}>
            {fotografen}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FotografenFilter;
