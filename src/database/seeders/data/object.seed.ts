interface ObjectSeedItem {
  obj_networkMAC: string;
  obj_name: string;
  obj_owner: string;
  obj_model: string;
  obj_brand: string;
  obj_function: string[];
  obj_restriction: string[];
  obj_limitation: string[];
  obj_access: number;
  obj_location: number;
  obj_qualification: number;
  obj_status: number;
}

// Função que gera MAC válido
function generateValidMAC(): string {
  const parts: string[] = [];

  // Gera 6 partes hexadecimais válidas (00 a FF)
  for (let i = 0; i < 6; i++) {
    // Gerar número entre 0-255 e converter para hex
    const hexValue = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    parts.push(hexValue);
  }

  return parts.join(':').toUpperCase();
}

function generateObjectSeed(): ObjectSeedItem[] {
  const brands = [
    'TechSensors',
    'SmartDevices',
    'IoTPro',
    'ConnectTech',
    'FutureSystems',
  ];
  const models = ['T1000', 'S2000', 'I3000', 'C4000', 'F5000'];
  const functions = [
    ['Medir temperatura', 'Enviar dados'],
    ['Monitorar umidade', 'Transmitir alertas'],
    ['Controlar acesso', 'Registrar entradas'],
    ['Medir pressão', 'Processar dados'],
    ['Detectar movimento', 'Acionar alarme'],
  ];
  const restrictions = [
    ['Uso interno', 'Não expor à água'],
    ['Uso externo', 'Proteger contra poeira'],
    ['Área controlada', 'Manutenção trimestral'],
    ['Temperatura ambiente', 'Evitar vibração'],
    ['Uso industrial', 'Proteção IP67'],
  ];
  const limitations = [
    ['Precisão ±0.5°C', 'Alcance -20°C a 60°C'],
    ['Precisão ±2%', 'Alcance 0% a 100%'],
    ['Tempo resposta 2s', 'Alcance 5m'],
    ['Precisão ±1%', 'Alcance 0-1000hPa'],
    ['Ângulo 120°', 'Distância 10m'],
  ];
  const owners = [
    'João Silva',
    'Maria Santos',
    'Pedro Costa',
    'Ana Oliveira',
    'Carlos Souza',
  ];

  const objects: ObjectSeedItem[] = [];

  for (let i = 0; i < 1000; i++) {
    const brandIndex = i % brands.length;
    const modelIndex = i % models.length;
    const functionIndex = i % functions.length;
    const restrictionIndex = i % restrictions.length;
    const limitationIndex = i % limitations.length;
    const ownerIndex = i % owners.length;

    objects.push({
      obj_networkMAC: generateValidMAC(),
      obj_name: `Dispositivo ${i + 1}`,
      obj_owner: owners[ownerIndex],
      obj_model: models[modelIndex],
      obj_brand: brands[brandIndex],
      obj_function: functions[functionIndex],
      obj_restriction: restrictions[restrictionIndex],
      obj_limitation: limitations[limitationIndex],
      obj_access: (i % 3) + 1,
      obj_location: (i % 4) + 1,
      obj_qualification: (i % 5) + 1,
      obj_status: (i % 2) + 1,
    });
  }

  return objects;
}

export const objectSeed = generateObjectSeed();
