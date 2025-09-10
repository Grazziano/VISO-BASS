export const onaEnvironmentSeed = Array.from({ length: 1000 }, (_, i) => {
  const objectNumber = i + 1;

  // Gera valores aleatórios dentro de ranges realistas
  const totalInteractions = 80 + Math.floor(Math.random() * 100); // 80-180 interações
  const totalValid = Math.floor(
    totalInteractions * (0.7 + Math.random() * 0.25),
  ); // 70-95% válidas
  const totalNew = totalInteractions - totalValid;

  // Gera 3-5 adjacências únicas
  const adjacencyCount = 3 + Math.floor(Math.random() * 3); // 3, 4 ou 5
  const adjacencySet = new Set();

  while (adjacencySet.size < adjacencyCount) {
    const randomAdj = Math.floor(Math.random() * 1000) + 1;
    if (randomAdj !== objectNumber) {
      adjacencySet.add(randomAdj);
    }
  }

  const envAdjacency = Array.from(adjacencySet);

  // Gera objetos correspondentes (3-5 objetos)
  const objectsCount = 3 + Math.floor(Math.random() * 3); // 3, 4 ou 5
  const objectsSet = new Set();
  objectsSet.add(`obj${objectNumber}`);

  while (objectsSet.size < objectsCount) {
    const randomObj = Math.floor(Math.random() * 1000) + 1;
    objectsSet.add(`obj${randomObj}`);
  }

  const objects = Array.from(objectsSet);

  return {
    env_object_i: objectNumber.toString(),
    env_total_interactions: totalInteractions,
    env_total_valid: totalValid,
    env_total_new: totalNew,
    env_adjacency: envAdjacency,
    objects: objects,
  };
});
