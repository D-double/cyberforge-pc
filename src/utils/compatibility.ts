import { CompatibilityIssue, CompatibilityReport, PCBuild } from '@/types';

export function checkCompatibility(build: PCBuild): CompatibilityReport {
  const issues: CompatibilityIssue[] = [];

  const { cpu, motherboard, gpu, ram, psu, case: pcCase, cooler } = build;

  // 1. CPU & Motherboard Socket
  if (cpu && motherboard) {
    const cpuSocket = cpu.specs?.socket;
    const mbSocket = motherboard.specs?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: 'error',
        field: 'socket',
        message: {
          ru: `Несовместимый сокет! Процессор ${cpu.name} требует сокет ${cpuSocket}, а материнская плата ${motherboard.name} имеет сокет ${mbSocket}.`,
          uz: `Mos kelmaydigan soket! Protsessor ${cpu.name} ${cpuSocket} soketini talab qiladi, ona plata ${motherboard.name} esa ${mbSocket} soketiga ega.`
        }
      });
    }
  }

  // 2. Motherboard & RAM Type
  if (motherboard && ram) {
    const mbRamType = motherboard.specs?.ramType;
    const ramType = ram.specs?.ramType;
    if (mbRamType && ramType && mbRamType !== ramType) {
      issues.push({
        type: 'error',
        field: 'ramType',
        message: {
          ru: `Несовместимый тип памяти! Материнская плата поддерживает ${mbRamType}, а выбранная ОЗУ — ${ramType}.`,
          uz: `Xotira turi mos kelmadi! Ona plata ${mbRamType} turini qo'llab-quvvatlaydi, tanlangan tezkor xotira esa ${ramType}.`
        }
      });
    }
  }

  // 3. Motherboard Form Factor & Case
  if (motherboard && pcCase) {
    const mbForm = motherboard.specs?.formFactor;
    const caseForms = pcCase.specs?.caseSupportedFormFactors as string[] | undefined;
    if (mbForm && caseForms && !caseForms.includes(mbForm)) {
      issues.push({
        type: 'error',
        field: 'formFactor',
        message: {
          ru: `Форм-фактор платы ${mbForm} не поддерживается корпусом ${pcCase.name} (поддерживает: ${caseForms.join(', ')}).`,
          uz: `Ona plataning ${mbForm} form-faktori ${pcCase.name} korpusiga sig'maydi (qo'llab-quvvatlaydi: ${caseForms.join(', ')}).`
        }
      });
    }
  }

  // 4. GPU Length & Case Max GPU Length
  if (gpu && pcCase) {
    const gpuLength = gpu.specs?.gpuLengthMM as number | undefined;
    const caseMaxGpu = pcCase.specs?.caseMaxGpuMM as number | undefined;
    if (gpuLength && caseMaxGpu && gpuLength > caseMaxGpu) {
      issues.push({
        type: 'error',
        field: 'gpuLength',
        message: {
          ru: `Видеокарта длиной ${gpuLength} мм не помещается в корпус (максимум ${caseMaxGpu} мм).`,
          uz: `Uzunligi ${gpuLength} mm bo'lgan videokarta korpusga sig'maydi (maksimal ${caseMaxGpu} mm).`
        }
      });
    }
  }

  // 5. Cooler Height & Case Max Cooler
  if (cooler && pcCase) {
    const coolerHeight = cooler.specs?.coolerHeightMM as number | undefined;
    const caseMaxCooler = pcCase.specs?.caseMaxCoolerHeightMM as number | undefined;
    const isAio = cooler.specs?.isAio as boolean | undefined;
    if (!isAio && coolerHeight && caseMaxCooler && coolerHeight > caseMaxCooler) {
      issues.push({
        type: 'error',
        field: 'coolerHeight',
        message: {
          ru: `Кулер высотой ${coolerHeight} мм превышает допустимую высоту для корпуса (${caseMaxCooler} мм).`,
          uz: `Kuler balandligi (${coolerHeight} mm) korpus uchun ruxsat etilgan balandlikdan (${caseMaxCooler} mm) oshib ketdi.`
        }
      });
    }
  }

  // 6. Cooler & CPU Socket
  if (cooler && cpu) {
    const cpuSocket = cpu.specs?.socket as string | undefined;
    const supportedSockets = cooler.specs?.coolerSockets as string[] | undefined;
    if (cpuSocket && supportedSockets && !supportedSockets.includes(cpuSocket)) {
      issues.push({
        type: 'error',
        field: 'coolerSocket',
        message: {
          ru: `Кулер не имеет креплений для сокета ${cpuSocket}.`,
          uz: `Kulerda ${cpuSocket} soketi uchun moslama yo'q.`
        }
      });
    }
  }

  // 7. Calculate TDP and Power Requirements
  const cpuTdp = cpu?.tdp || 65;
  const gpuTdp = gpu?.tdp || (gpu ? 150 : 0);
  const baseSystemWattage = 70; // Motherboard, fans, RAM, SSD
  const totalTdp = (cpu ? cpuTdp : 0) + gpuTdp + baseSystemWattage;
  const recommendedPsuWattage = Math.ceil((totalTdp * 1.3) / 50) * 50; // 30% headroom

  // PSU Check
  if (psu) {
    const psuW = psu.specs?.psuWattage as number | undefined;
    if (psuW) {
      if (psuW < totalTdp) {
        issues.push({
          type: 'error',
          field: 'psuPower',
          message: {
            ru: `Блок питания мощностью ${psuW}W недостаточен для системы с потреблением от ${totalTdp}W! Возможны выключения под нагрузкой.`,
            uz: `Quvvati ${psuW}W bo'lgan quvvat bloki ${totalTdp}W talab qiladigan tizim uchun yetarli emas! Tizim o'chib qolishi mumkin.`
          }
        });
      } else if (psuW < recommendedPsuWattage) {
        issues.push({
          type: 'warning',
          field: 'psuHeadroom',
          message: {
            ru: `Блока питания на ${psuW}W хватит впритык, но рекомендуется минимум ${recommendedPsuWattage}W для тихого и долговечного режима работы.`,
            uz: `${psuW}W quvvat bloki yetarli, ammo xavfsiz va sokin ishlashi uchun kamida ${recommendedPsuWattage}W tavsiya etiladi.`
          }
        });
      }
    }
  }

  const hasErrors = issues.some((i) => i.type === 'error');

  return {
    isCompatible: !hasErrors,
    totalTdp,
    recommendedPsuWattage,
    issues,
  };
}
