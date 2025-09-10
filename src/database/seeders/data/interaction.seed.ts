// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const interactionsSeed = Array.from({ length: 1000 }, (_, i) => {
  // Objetos baseados em padrões de interação realistas
  const objI = Math.floor(Math.random() * 100) + 1; // 100 objetos mais ativos
  const objJ = Math.floor(Math.random() * 1000) + 1;

  // Janela de tempo: julho de 2025, distribuído uniformemente
  const day = Math.floor(Math.random() * 31) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);

  const startDate = new Date(
    `2025-07-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`,
  );

  // Duração variável: 15 minutos a 3 horas
  const duration = 15 + Math.floor(Math.random() * 165);
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration);

  // Feedback baseado na duração (interações mais longas tendem a ter feedback positivo)
  const feedback = duration > 45 || Math.random() < 0.6;

  // Serviço baseado no tipo de interação
  const service =
    objI <= 50
      ? Math.floor(Math.random() * 3) + 1
      : Math.floor(Math.random() * 7) + 4;

  return {
    inter_obj_i: objI,
    inter_obj_j: objJ,
    inter_start: startDate.toISOString(),
    inter_end: endDate.toISOString(),
    inter_feedback: feedback,
    inter_service: service,
  };
});
