import axios from "axios";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>teste</Text>
      {loading ? (
        <Text style={styles.subtitle}>Carregando...</Text>
      ) : (
        users.map((user) => (
          <Text key={user.id} style={styles.subtitle}>
            {user.id} - {user.name} ({user.email})
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#eb4034",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    textAlign: "center",
    marginBottom: 5,
  },
});
