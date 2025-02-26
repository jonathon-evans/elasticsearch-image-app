import React from 'react';
import { render, screen, fireEvent, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageItem from '../../src/app/components/ImageItem';
import { ImageItemResult } from '../../src/app/api/images/route';

const mockImage: ImageItemResult = {
  id: '1',
  bildnummer: '123',
  datum: '2025-02-25',
  suchtext: 'test',
  fotografen: 'Dalton Evans',
  url: 'http://example.com/image.jpg',
  source: 'source1',
};

const mockImageWithoutUrl: ImageItemResult = {
  id: '2',
  bildnummer: '456',
  datum: '2025-02-26',
  suchtext: 'test2',
  fotografen: 'Evans Dalton',
  url: undefined,
  source: 'source2',
};

describe('ImageItem', () => {
  it('should render the ImageItem component with an image', () => {
    render(<ImageItem image={mockImage} />);

    expect(
      screen.getByAltText(`Image ${mockImage.bildnummer}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Bildnummer: ${mockImage.bildnummer}`)
    ).toBeInTheDocument();
  });

  it('should render the ImageItem component with a placeholder when image URL is not available', () => {
    render(<ImageItem image={mockImageWithoutUrl} />);

    expect(screen.getByTestId('BrokenImageIcon')).toBeInTheDocument();
    expect(
      screen.getByText(`Bildnummer: ${mockImageWithoutUrl.bildnummer}`)
    ).toBeInTheDocument();
  });

  /* it('should open and close the modal when the image is clicked', () => {
    render(<ImageItem image={mockImage} />);

    const imageCard = screen.getByAltText(`Image ${mockImage.bildnummer}`);
    fireEvent.click(imageCard);

    expect(
      screen.getByText(`Fotografen: ${mockImage.fotografen}`)
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    console.log(prettyDOM(document.body));

    expect(
      screen.getByText(`Fotografen: ${mockImage.fotografen}`)
    ).not.toBeInTheDocument();
  }); */
});
