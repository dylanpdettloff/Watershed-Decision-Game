import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../state/GameContext';
import { roles, RoleKey } from '../store/content';

export default function RoleSelectScreen() {
  const nav = useNavigation<any>();
  const { setRole, reset } = useGame();

  React.useEffect(() => { reset(); }, []);

  // DEBUG: see what we're getting
  console.log('DEBUG roles length =', (roles as any)?.length);

  if (!roles || roles.length === 0) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={{ color: '#fca5a5', textAlign: 'center' }}>
          No roles found. Make sure {'src/store/content.ts'} exports {'`roles`'} and that this file imports from {'../store/content'}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <FlatList
        data={roles}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              setRole(item.key as RoleKey);
              // @ts-ignore simple route name
              nav.navigate('Scenario');
            }}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardBlurb}>{item.blurb}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1326', padding: 16 },
  title: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#111b38', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1f2a44' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  cardBlurb: { color: '#cbd5e1' },
});