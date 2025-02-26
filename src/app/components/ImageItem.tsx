import React, { useState } from 'react';
import { Card, CardMedia, Typography, Box } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import ImageInfoModal from './ImageInfoModal';
import { ImageItemResult } from '@/api/images/route';

interface ImageItemProps {
  image: ImageItemResult;
}

const ImageItem: React.FC<ImageItemProps> = (props) => {
  const { image } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Card onClick={handleOpenModal}>
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
        <Typography variant="body2" color="textSecondary" component="p">
          Bildnummer: {image.bildnummer}
        </Typography>
      </Card>
      <ImageInfoModal
        open={modalOpen}
        onClose={handleCloseModal}
        image={image}
      />
    </>
  );
};

export default ImageItem;
