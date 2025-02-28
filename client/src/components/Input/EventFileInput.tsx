import React, { useRef, useState } from 'react';
import { Button } from '@mui/material';
import Alert from '../Alert/Alert';

type FileUploadProps = {
  label: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  isFlyer: boolean;
  onChange: (file: File[] | null) => void;
  onImageDimensions?: (width: number, height: number) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  disabled = false,
  required = false,
  isFlyer,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  const verifyImageSize = async (image: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        const validSizes = [
        { width: 1080, height: 1350 },
        { width: 1080, height: 1080 },
        { width: 1080, height: 566 },
        { width: 1080, height: 1920 },
        ];

        const isValidSize = validSizes.some((size) => (
          width === size.width && height === size.height
        ));

        if (isValidSize) {
          resolve(true);
        } else {
          setShowMessage('La imágen no cumple con los tamaños requeridos');
          setShowInfo(true);
          resolve(false);
        }
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowInfo(false);

    const newFiles = Array.from(event.target.files || []);

    if (isFlyer) {
      const isValidSize = await Promise.all(newFiles.map(verifyImageSize));

      if (isValidSize.every((valid) => valid)) {
        onChange(newFiles);
      }
    } else {
      onChange(newFiles);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled}
        required={required}
        multiple={!isFlyer}
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={disabled}
      >
        {label}
      </Button>
      {showInfo && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            margin: '0px 0px 10px 0px',
          }}
        >
          <Alert
            label={showMessage}
            severity="info"
            onClose={() => setShowInfo(false)}
          />
        </div>
      )}
    </>
  );
};

export default FileUpload;
