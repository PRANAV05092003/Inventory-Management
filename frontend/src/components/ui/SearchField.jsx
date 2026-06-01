import { InputAdornment, TextField } from '@mui/material';
import { Search } from 'lucide-react';
import { memo } from 'react';

function SearchField({ value, onChange, placeholder = 'Search...', sx = {} }) {
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputProps={{ 'aria-label': placeholder }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} />
          </InputAdornment>
        ),
      }}
      sx={{ minWidth: { xs: '100%', sm: 280 }, ...sx }}
    />
  );
}

export default memo(SearchField);
