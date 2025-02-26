import React from 'react';
import { Modal, Box, Typography, CardMedia } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { ImageItemResult } from '@/api/images/route';

interface ImageInfoModalProps {
  open: boolean;
  onClose: () => void;
  image: ImageItemResult | null;
}

const ImageInfoModal: React.FC<ImageInfoModalProps> = ({
  open,
  onClose,
  image,
}) => {
  if (!image) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        {image.url ? (
          <CardMedia
            component="img"
            image={image.url}
            alt={`Image ${image.bildnummer}`}
            style={{ height: '300px', width: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
            width="100%"
          >
            <BrokenImageIcon fontSize="large" />
          </Box>
        )}
        <Typography variant="h6" component="h2">
          Bildnummer: {image.bildnummer}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Datum: {image.datum}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Suchtext: {image.suchtext}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fotografen: {image.fotografen}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ImageInfoModal;
