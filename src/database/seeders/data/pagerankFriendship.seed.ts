export const pagerankFriendshipSeed = Array.from({ length: 1000 }, (_, i) => {
  const objectNumber = i + 1;

  // Gera objetos adjacentes únicos (entre 3-5 objetos por array)
  const adjacencyCount = 3 + (i % 3); // 3, 4 ou 5 objetos
  const adjacentObjects = Array.from({ length: adjacencyCount }, (_, j) => {
    const adjNumber = ((objectNumber + j + 1) % 1000) + 1; // Garante que não ultrapasse 1000
    return `obj${adjNumber}`;
  });

  return {
    rank_object: `obj${objectNumber}`,
    rank_adjacency: adjacentObjects,
  };
});
