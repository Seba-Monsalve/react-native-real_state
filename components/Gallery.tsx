import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const images = [
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' },
  { uri: 'https://example.com/image3.jpg' },
  // Agrega más imágenes según sea necesario
];

const Gallery = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  return (
    <View>
        
      <FlatList
        data={images}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openImageViewer(index)}>
            <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 5 }} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
};

export default Gallery;