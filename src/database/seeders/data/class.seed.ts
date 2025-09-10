// Gera um array de 1000 classes
export const classSeed = Array.from({ length: 1000 }, (_, i) => {
  const classNumber = i + 1;
  const objectId1 = `688281${(793 + i * 3).toString().padStart(10, '0')}`;
  const objectId2 = `688281${(796 + i * 3).toString().padStart(10, '0')}`;

  return {
    class_name: `Class ${classNumber}`,
    class_function: [
      `Class ${classNumber} Function 1`,
      `Class ${classNumber} Function 2`,
    ],
    objects: [objectId1, objectId2],
  };
});
