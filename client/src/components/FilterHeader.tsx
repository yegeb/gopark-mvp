import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, FlatList } from 'react-native';

interface FilterHeaderProps {
  onFilterChange: (district: string, neighborhood: string) => void;
}

const DISTRICTS = ['Kadikoy', 'Besiktas', 'Sisli', 'Beyoglu', 'Uskudar', 'Fatih', 'Sariyer'];
const NEIGHBORHOODS: Record<string, string[]> = {
  'Kadikoy': ['Caferaga', 'Moda', 'Rasimpasa', 'Caddebostan', 'Bostanci', 'Hasanpasa', 'Erenkoy', 'Osmanaga', 'Feneryolu', 'Suadiye', 'Acibadem'],
  'Besiktas': ['Sinanpasa', 'Visnezade', 'Cihannuma', 'Mecidiye', 'Bebek', 'Balmumcu', 'Yildiz', 'Dikilitas', 'Carsi', 'Etiler', 'Gayrettepe', 'Levent'],
  'Sisli': ['Tesvikiye', 'Harbiye', 'Ferikoy', 'Merkez', 'Halil Rifat Pasa', 'Bomonti', 'Cumhuriyet', 'Mecidiyekoy', 'Halaskargazi', 'Fulya', 'Kurtulus', 'Esentepe', 'Nisantasi'],
  'Beyoglu': ['Tepebasi', 'Sishane', 'Karakoy', 'Bereketzade', 'Taksim', 'Cihangir', 'Kabatas', 'Dolapdere'],
  'Uskudar': ['Mimar Sinan', 'Salacak', 'Altunizade', 'Ahmediye', 'Kuzguncuk', 'Beylerbeyi'],
  'Fatih': ['Sultanahmet', 'Eminonu', 'Yenikapi', 'Balat'],
  'Sariyer': ['Emirgan', 'Tarabya']
};

const FilterHeader: React.FC<FilterHeaderProps> = ({ onFilterChange }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<{ type: 'district' | 'neighborhood' | null }>({ type: null });

  const handleSelect = (item: string) => {
    if (modalVisible.type === 'district') {
      setSelectedDistrict(item);
      setSelectedNeighborhood(''); // Reset neighborhood when district changes
      setModalVisible({ type: null });
      // We might not trigger filter change immediately until neighborhood is also picked, or allow partial filter
      onFilterChange(item, '');
    } else if (modalVisible.type === 'neighborhood') {
      setSelectedNeighborhood(item);
      setModalVisible({ type: null });
      onFilterChange(selectedDistrict, item);
    }
  };

  const currentOptions = modalVisible.type === 'district' ? DISTRICTS : (selectedDistrict ? NEIGHBORHOODS[selectedDistrict] : []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={() => setModalVisible({ type: 'district' })}
      >
        <Text style={styles.selectorText}>{selectedDistrict || 'Select District'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.selector, !selectedDistrict && styles.disabled]} 
        onPress={() => selectedDistrict && setModalVisible({ type: 'neighborhood' })}
        disabled={!selectedDistrict}
      >
        <Text style={styles.selectorText}>{selectedNeighborhood || 'Select Neighborhood'}</Text>
      </TouchableOpacity>

      <Modal visible={!!modalVisible.type} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>Select {modalVisible.type === 'district' ? 'District' : 'Neighborhood'}</Text>
             <FlatList
                data={currentOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
             />
             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible({ type: null })}>
                <Text style={styles.closeButtonText}>Close</Text>
             </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 10, backgroundColor: '#f0f0f0' },
  selector: { flex: 1, padding: 10,  backgroundColor: 'white', marginHorizontal: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  disabled: { opacity: 0.5 },
  selectorText: { fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  option: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  optionText: { fontSize: 16 },
  closeButton: { marginTop: 10, padding: 15, backgroundColor: '#ddd', borderRadius: 5, alignItems: 'center' },
  closeButtonText: { fontWeight: 'bold' }
});

export default FilterHeader;
