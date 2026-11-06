const DEPOSIT_CENTS = 12000;

const learningLevels = [
  {
    id: "fundamental-1",
    name: "Fundamental I",
    grade: "5º ano",
    tracks: [
      {
        id: "meu-dinheiro",
        name: "Meu dinheiro",
        description: "Entenda o valor do dinheiro nas escolhas do dia a dia.",
        modules: [
          { id: "origem-dinheiro", name: "De onde vem o dinheiro?", description: "Conheça diferentes formas de receber e usar dinheiro.", rewardCents: 2000 },
          { id: "necessidade-vontade", name: "Necessidade ou vontade?", description: "Aprenda a diferenciar o que precisamos do que desejamos.", rewardCents: 2000 },
          { id: "escolhas-dia", name: "Escolhas do dia a dia", description: "Veja como pequenas decisões mudam o que sobra.", rewardCents: 2000 }
        ]
      },
      {
        id: "escolhas-objetivos",
        name: "Escolhas e objetivos",
        description: "Planeje pequenas metas e descubra como chegar até elas.",
        modules: [
          { id: "sonho-meta", name: "Do sonho à meta", description: "Transforme uma vontade em um objetivo possível.", rewardCents: 2000 },
          { id: "comparar-opcoes", name: "Compare suas opções", description: "Pense antes de escolher como usar seu dinheiro.", rewardCents: 2000 },
          { id: "plano-conquista", name: "Meu plano de conquista", description: "Organize os passos para alcançar sua meta.", rewardCents: 2000 }
        ]
      }
    ]
  },
  {
    id: "fundamental-2",
    name: "Fundamental II",
    grade: "8º ano",
    tracks: [
      {
        id: "orcamento-sem-misterio",
        name: "Orçamento sem mistério",
        description: "Organize entradas, gastos e prioridades.",
        modules: [
          { id: "mapa-gastos", name: "Mapa dos meus gastos", description: "Identifique para onde vai o dinheiro.", rewardCents: 2000 },
          { id: "orcamento-equilibrado", name: "Um orçamento equilibrado", description: "Distribua recursos entre necessidades e planos.", rewardCents: 2000 },
          { id: "imprevistos", name: "Preparação para imprevistos", description: "Entenda por que reservar uma parte faz diferença.", rewardCents: 2000 }
        ]
      },
      {
        id: "consumo-consciente",
        name: "Consumo consciente",
        description: "Avalie escolhas de consumo com atenção e responsabilidade.",
        modules: [
          { id: "publicidade-escolhas", name: "Publicidade e escolhas", description: "Reconheça influências antes de comprar.", rewardCents: 2000 },
          { id: "preco-valor", name: "Preço, valor e comparação", description: "Compare alternativas para decidir melhor.", rewardCents: 2000 },
          { id: "poupanca-projetos", name: "Poupança para projetos", description: "Planeje uma meta de médio prazo.", rewardCents: 2000 }
        ]
      }
    ]
  },
  {
    id: "ensino-medio",
    name: "Ensino Médio",
    grade: "2º ano do Ensino Médio",
    tracks: [
      {
        id: "planejamento-financeiro",
        name: "Planejamento financeiro",
        description: "Crie um plano alinhado às suas prioridades e objetivos.",
        modules: [
          { id: "metas-orcamento", name: "Metas e orçamento", description: "Conecte objetivos a um plano financeiro realista.", rewardCents: 2000 },
          { id: "reserva-emergencia", name: "Reserva de emergência", description: "Calcule a importância de se preparar para imprevistos.", rewardCents: 2000 },
          { id: "juros-tempo", name: "Juros e passagem do tempo", description: "Compare cenários e entenda o efeito dos juros.", rewardCents: 2000 }
        ]
      },
      {
        id: "credito-investimentos",
        name: "Crédito e investimentos",
        description: "Conheça compromissos, possibilidades e riscos financeiros.",
        modules: [
          { id: "credito-custo", name: "Crédito: custo e cuidado", description: "Avalie o custo total antes de assumir crédito.", rewardCents: 2000 },
          { id: "perfil-risco", name: "Risco e perfil", description: "Relacione riscos a objetivos e prazos.", rewardCents: 2000 },
          { id: "investimento-diversificacao", name: "Diversificação na prática", description: "Entenda por que existem diferentes alternativas.", rewardCents: 2000 }
        ]
      }
    ]
  }
];

const student = {
  name: "Sofia",
  levelId: "fundamental-1"
};

const INITIAL_DEPOSIT_CENTS = 12000;
const DEMO_STATE_VERSION = 1;
const STORAGE_KEY = "first-finance-demo-v1";
const OPENING_DEPOSIT_ID = "opening-deposit";
const REWARD_MOVEMENT_PREFIX = "reward-earned:";
let pendingFinancialOperation = null;
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function createInitialDemoState() {
  return {
    version: DEMO_STATE_VERSION,
    completedModuleIds: [],
    movements: [{
      id: OPENING_DEPOSIT_ID,
      type: "deposit",
      amountCents: INITIAL_DEPOSIT_CENTS,
      date: new Date().toISOString(),
      description: "Depósito inicial da demonstração"
    }]
  };
}

let demoState;

function getRewardTotal(level) {
  return level.tracks
    .flatMap((track) => track.modules)
    .reduce((total, module) => total + module.rewardCents, 0);
}

function getAccountBalances(state = demoState, level = getActiveLevel()) {
  const modules = level.tracks.flatMap((track) => track.modules);
  const completedIds = new Set(state.completedModuleIds);
  const movements = state.movements;
  const grossDepositsCents = movements
    .filter((movement) => movement.type === "deposit")
    .reduce((total, movement) => total + movement.amountCents, 0);
  const withdrawalsCents = movements
    .filter((movement) => movement.type === "withdrawal")
    .reduce((total, movement) => total + movement.amountCents, 0);
  const rewardBudgetCents = getRewardTotal(level);
  const earnedCents = movements
    .filter((movement) => movement.type === "reward-earned")
    .reduce((total, movement) => total + movement.amountCents, 0);
  const redeemedCents = movements
    .filter((movement) => movement.type === "redemption")
    .reduce((total, movement) => total + movement.amountCents, 0);
  const incompleteRewardCents = modules
    .filter((module) => !completedIds.has(module.id))
    .reduce((total, module) => total + module.rewardCents, 0);
  const netFundingCents = grossDepositsCents - withdrawalsCents;
  const freeCents = netFundingCents - rewardBudgetCents;
  const availableCents = earnedCents - redeemedCents;
  const lockedCents = freeCents + incompleteRewardCents;

  return {
    grossDepositsCents,
    withdrawalsCents,
    rewardBudgetCents,
    freeCents,
    earnedCents,
    lockedCents,
    availableCents,
    redeemedCents,
    netFundingCents
  };
}

function assertAccountInvariants(state = demoState) {
  if (state.version !== DEMO_STATE_VERSION || !Array.isArray(state.completedModuleIds) || !Array.isArray(state.movements)) {
    throw new Error("O estado da demonstração possui um formato inválido.");
  }

  for (const level of learningLevels) {
    if (getRewardTotal(level) !== INITIAL_DEPOSIT_CENTS) {
      throw new Error(`As recompensas de ${level.name} não correspondem à mesada fictícia.`);
    }
  }

  const level = getActiveLevel();
  const modules = level.tracks.flatMap((track) => track.modules);
  const moduleById = new Map(modules.map((module) => [module.id, module]));
  const completedIds = new Set(state.completedModuleIds);
  const movementIds = new Set();
  const rewardedModuleIds = new Set();

  if (completedIds.size !== state.completedModuleIds.length || [...completedIds].some((id) => !moduleById.has(id))) {
    throw new Error("As conclusões dos módulos estão inconsistentes.");
  }

  for (const movement of state.movements) {
    const allowedTypes = ["deposit", "withdrawal", "reward-earned", "redemption"];
    if (!movement.id || movementIds.has(movement.id) || !allowedTypes.includes(movement.type) || !Number.isSafeInteger(movement.amountCents) || movement.amountCents <= 0 || !Number.isFinite(Date.parse(movement.date)) || typeof movement.description !== "string" || !movement.description.trim()) {
      throw new Error("O histórico contém uma movimentação inválida ou duplicada.");
    }
    movementIds.add(movement.id);

    if (movement.type === "reward-earned") {
      const module = moduleById.get(movement.moduleId);
      if (!module || movement.amountCents !== module.rewardCents || rewardedModuleIds.has(module.id) || !completedIds.has(module.id)) {
        throw new Error("O histórico de recompensas dos módulos está inconsistente.");
      }
      rewardedModuleIds.add(module.id);
    }
  }

  const openingDeposits = state.movements.filter((movement) => movement.id === OPENING_DEPOSIT_ID);
  if (openingDeposits.length !== 1 || openingDeposits[0].type !== "deposit" || openingDeposits[0].amountCents !== INITIAL_DEPOSIT_CENTS) {
    throw new Error("O depósito inicial da demonstração está ausente ou duplicado.");
  }

  if ([...completedIds].some((id) => !rewardedModuleIds.has(id))) {
    throw new Error("Há módulos concluídos sem movimentação de recompensa.");
  }

  const balances = getAccountBalances(state, level);
  const allocatedBalanceCents = balances.lockedCents + balances.availableCents + balances.redeemedCents;
  if (balances.freeCents < 0 || balances.availableCents < 0 || balances.redeemedCents < 0 || allocatedBalanceCents !== balances.netFundingCents) {
    throw new Error("Os saldos da demonstração não respeitam a invariável da conta.");
  }
}

function cloneDemoState(state) {
  return {
    version: state.version,
    completedModuleIds: [...state.completedModuleIds],
    movements: state.movements.map((movement) => ({ ...movement }))
  };
}

function persistDemoState(state) {
  assertAccountInvariants(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadDemoState() {
  const initialState = createInitialDemoState();
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState === null) {
      persistDemoState(initialState);
      return initialState;
    }

    const parsedState = JSON.parse(storedState);
    assertAccountInvariants(parsedState);
    return parsedState;
  } catch {
    try {
      persistDemoState(initialState);
    } catch {
      // The demo can still render in memory when browser storage is unavailable.
    }
    return initialState;
  }
}

function commitDemoState(nextState) {
  try {
    persistDemoState(nextState);
    demoState = nextState;
    return true;
  } catch {
    return false;
  }
}

function getActiveLevel() {
  return learningLevels.find((level) => level.id === student.levelId);
}

function getActiveModules() {
  return getActiveLevel().tracks.flatMap((track) => track.modules);
}

function renderModule(module, index) {
  const completed = demoState.completedModuleIds.includes(module.id);
  const completionLabel = completed ? "Módulo concluído" : "Concluir módulo";

  return `
    <article class="module-card${completed ? " is-complete" : ""}" data-module-id="${module.id}">
      <div class="module-copy">
        <span class="module-number">MÓDULO ${String(index + 1).padStart(2, "0")}</span>
        <h4>${module.name}</h4>
        <p class="module-description">${module.description}</p>
        <div class="material-list" aria-label="Materiais ilustrativos">
          <span class="material-item"><span class="material-mark" aria-hidden="true">A</span>Apostila · exemplo</span>
          <span class="material-item"><span class="material-mark" aria-hidden="true">▶</span>Videoaula · exemplo</span>
          <span class="material-item">Conteúdo ilustrativo</span>
        </div>
        <p class="module-reward">Recompensa ao concluir: <strong>${currency.format(module.rewardCents / 100)}</strong></p>
      </div>
      <div class="module-action">
        <button class="completion-button${completed ? " is-complete" : ""}" type="button" data-complete-module="${module.id}"${completed ? " disabled" : ""}>${completionLabel}</button>
      </div>
    </article>
  `;
}

function renderTrack(track) {
  const completedCount = track.modules.filter((module) => demoState.completedModuleIds.includes(module.id)).length;
  const percentage = Math.round((completedCount / track.modules.length) * 100);

  return `
    <section class="track-section" aria-labelledby="track-${track.id}">
      <div class="track-heading">
        <div>
          <h3 id="track-${track.id}">${track.name}</h3>
          <p class="track-description">${track.description}</p>
        </div>
        <p class="track-meta">${completedCount} de ${track.modules.length}<br>módulos</p>
      </div>
      <div class="progress-track" role="progressbar" aria-label="Progresso: ${track.name}" aria-valuemin="0" aria-valuemax="${track.modules.length}" aria-valuenow="${completedCount}">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="module-list">
        ${track.modules.map((module, index) => renderModule(module, index)).join("")}
      </div>
    </section>
  `;
}

function renderLearning() {
  const level = getActiveLevel();
  document.querySelector(".context-level").textContent = `${level.grade} · ${level.name}`;
  document.querySelector(".student-name").textContent = student.name;
  document.querySelector(".guardian-student-name").textContent = student.name;
  document.querySelector(".student-profile").setAttribute("aria-label", `Aluna ${student.name}`);
  document.querySelector("#learning-content").innerHTML = level.tracks.map(renderTrack).join("");
}

function renderRewards(notice = "Conclua módulos para liberar parte da sua mesada fictícia.", noticeType = "") {
  const balances = getAccountBalances();
  document.querySelector("#reward-content").innerHTML = `
    <div class="balance-grid" aria-label="Saldos da mesada fictícia">
      <div class="balance-card">
        <span class="balance-label">Bloqueado</span>
        <strong class="balance-value">${currency.format(balances.lockedCents / 100)}</strong>
      </div>
      <div class="balance-card is-available">
        <span class="balance-label">Disponível para resgate</span>
        <strong class="balance-value">${currency.format(balances.availableCents / 100)}</strong>
      </div>
      <div class="balance-card is-redeemed">
        <span class="balance-label">Resgatado</span>
        <strong class="balance-value">${currency.format(balances.redeemedCents / 100)}</strong>
      </div>
    </div>
    <p class="deposit-line"><span>Mesada fictícia depositada</span><strong>${currency.format(balances.grossDepositsCents / 100)}</strong></p>
    <div class="reward-actions">
      <p class="reward-notice${noticeType ? ` ${noticeType}` : ""}" role="status" aria-live="polite">${notice}</p>
      <button class="redeem-button" type="button"${balances.availableCents === 0 ? " disabled" : ""}>Resgatar valor disponível</button>
    </div>
  `;
}

function renderGuardianMetrics() {
  const balances = getAccountBalances();
  const metrics = [
    { label: "Total depositado", value: balances.grossDepositsCents },
    { label: "Saldo livre", value: balances.freeCents },
    { label: "Recompensas conquistadas", value: balances.earnedCents },
    { label: "Total resgatado", value: balances.redeemedCents }
  ];

  document.querySelector("#guardian-metrics").innerHTML = metrics.map((metric) => `
    <article class="guardian-metric">
      <span class="guardian-metric-label">${metric.label}</span>
      <strong class="guardian-metric-value">${currency.format(metric.value / 100)}</strong>
    </article>
  `).join("");
}

function renderGuardianProgress() {
  const level = getActiveLevel();
  const modules = getActiveModules();
  const completedCount = demoState.completedModuleIds.length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  const tracksMarkup = level.tracks.map((track) => {
    const trackCompletedCount = track.modules.filter((module) => demoState.completedModuleIds.includes(module.id)).length;
    const moduleRows = track.modules.map((module) => {
      const completed = demoState.completedModuleIds.includes(module.id);
      return `
        <div class="guardian-module-row${completed ? " is-complete" : ""}">
          <div class="guardian-module-copy">
            <strong>${module.name}</strong>
            <span>${completed ? "Concluído" : "Pendente"}</span>
          </div>
          <span class="guardian-module-reward">${currency.format(module.rewardCents / 100)} ${completed ? "conquistados" : "ao concluir"}</span>
        </div>
      `;
    }).join("");

    return `
      <section class="guardian-track" aria-labelledby="guardian-track-${track.id}">
        <div class="guardian-track-heading">
          <div>
            <h3 id="guardian-track-${track.id}">${track.name}</h3>
            <p>${track.description}</p>
          </div>
          <span>${trackCompletedCount} de ${track.modules.length} módulos</span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="Progresso: ${track.name}" aria-valuemin="0" aria-valuemax="${track.modules.length}" aria-valuenow="${trackCompletedCount}">
          <div class="progress-fill" style="width: ${Math.round((trackCompletedCount / track.modules.length) * 100)}%"></div>
        </div>
        <div class="guardian-module-list">${moduleRows}</div>
      </section>
    `;
  }).join("");

  document.querySelector("#guardian-learning-progress").innerHTML = `
    <div class="guardian-progress-summary">
      <div class="guardian-progress-copy">
        <span>Progresso geral · ${level.name}</span>
        <strong>${completedCount} de ${modules.length} módulos concluídos</strong>
      </div>
      <span class="guardian-progress-percent">${progressPercent}%</span>
      <div class="progress-track" role="progressbar" aria-label="Progresso geral do aluno" aria-valuemin="0" aria-valuemax="${modules.length}" aria-valuenow="${completedCount}">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
    </div>
    <div class="guardian-track-list">${tracksMarkup}</div>
  `;
}

function renderGuardianDashboard() {
  renderGuardianMetrics();
  renderGuardianProgress();
  renderGuardianFinancialControls();
  renderGuardianHistory();
}

function makeMovementId(type, state = demoState) {
  return `${type}-${Date.now()}-${state.movements.length}`;
}

function setGuardianFeedback(message, type = "") {
  const feedback = document.querySelector("#guardian-operation-feedback");
  feedback.textContent = message;
  feedback.className = `reward-notice guardian-operation-feedback${type ? ` ${type}` : ""}`;
}

function renderGuardianFinancialControls() {
  const freeCents = getAccountBalances().freeCents;
  const withdrawalInput = document.querySelector("#withdrawal-amount");
  const withdrawalButton = document.querySelector("#withdrawal-form .finance-submit");
  withdrawalInput.max = (freeCents / 100).toFixed(2);
  withdrawalInput.disabled = freeCents === 0;
  withdrawalButton.disabled = freeCents === 0;
  document.querySelector("#withdrawal-available").textContent = currency.format(freeCents / 100);
}

function renderGuardianHistory() {
  const movementLabels = {
    deposit: "Depósito",
    withdrawal: "Retirada",
    "reward-earned": "Recompensa conquistada",
    redemption: "Resgate"
  };
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
  const movements = [...demoState.movements].sort((first, second) => Date.parse(second.date) - Date.parse(first.date));

  if (movements.length === 0) {
    document.querySelector("#guardian-history").innerHTML = '<p class="history-empty">Nenhuma movimentação registrada.</p>';
    return;
  }

  document.querySelector("#guardian-history").innerHTML = `
    <div class="history-heading">
      <h3>Histórico de movimentações</h3>
      <span>${movements.length} ${movements.length === 1 ? "movimentação" : "movimentações"}</span>
    </div>
    <ol class="movement-list">
      ${movements.map((movement) => {
        const outgoing = movement.type === "withdrawal";
        const prefix = movement.type === "deposit" || movement.type === "reward-earned" ? "+" : outgoing ? "-" : "";
        return `
          <li class="movement-row movement-${movement.type}">
            <div class="movement-copy">
              <span class="movement-type">${movementLabels[movement.type]}</span>
              <strong>${movement.description}</strong>
              <time datetime="${movement.date}">${dateFormatter.format(new Date(movement.date))}</time>
            </div>
            <span class="movement-amount${outgoing ? " is-outgoing" : ""}">${prefix}${currency.format(movement.amountCents / 100)}</span>
          </li>
        `;
      }).join("")}
    </ol>
  `;
}

function applyDeposit(amountCents) {
  const nextState = cloneDemoState(demoState);
  nextState.movements.push({
    id: makeMovementId("deposit", nextState),
    type: "deposit",
    amountCents,
    date: new Date().toISOString(),
    description: "Depósito demonstrativo do responsável"
  });

  if (!commitDemoState(nextState)) {
    setGuardianFeedback("Não foi possível salvar o depósito neste navegador.", "is-warning");
    return false;
  }

  setGuardianFeedback(`Depósito de ${currency.format(amountCents / 100)} confirmado na demonstração.`, "is-success");
  renderRewards("Depósito demonstrativo registrado no saldo livre.", "is-success");
  renderGuardianDashboard();
  return true;
}

function applyWithdrawal(amountCents) {
  const currentBalances = getAccountBalances();
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0 || amountCents > currentBalances.freeCents) {
    setGuardianFeedback("O valor excede o saldo livre disponível para retirada.", "is-warning");
    return false;
  }

  const nextState = cloneDemoState(demoState);
  nextState.movements.push({
    id: makeMovementId("withdrawal", nextState),
    type: "withdrawal",
    amountCents,
    date: new Date().toISOString(),
    description: "Retirada demonstrativa do saldo livre"
  });

  if (!commitDemoState(nextState)) {
    setGuardianFeedback("Não foi possível salvar a retirada neste navegador.", "is-warning");
    return false;
  }

  setGuardianFeedback(`Retirada de ${currency.format(amountCents / 100)} confirmada na demonstração.`, "is-success");
  renderRewards("Retirada demonstrativa registrada; recompensas do aluno preservadas.", "is-success");
  renderGuardianDashboard();
  return true;
}

function openOperationConfirmation(type, amountCents) {
  const isDeposit = type === "deposit";
  pendingFinancialOperation = { type, amountCents };
  document.querySelector("#operation-dialog-title").textContent = isDeposit ? "Confirmar depósito" : "Confirmar retirada";
  document.querySelector("#operation-dialog-message").textContent = isDeposit
    ? `Adicionar ${currency.format(amountCents / 100)} ao saldo livre da demonstração?`
    : `Retirar ${currency.format(amountCents / 100)} do saldo livre da demonstração?`;
  document.querySelector("#operation-confirm").textContent = isDeposit ? "Confirmar depósito" : "Confirmar retirada";
  document.querySelector("#operation-dialog").showModal();
}

function completeModule(moduleId) {
  const module = getActiveModules().find((item) => item.id === moduleId);
  if (!module || demoState.completedModuleIds.includes(moduleId)) {
    return;
  }

  const nextState = cloneDemoState(demoState);
  nextState.completedModuleIds.push(moduleId);
  nextState.movements.push({
    id: `${REWARD_MOVEMENT_PREFIX}${moduleId}`,
    type: "reward-earned",
    moduleId,
    amountCents: module.rewardCents,
    date: new Date().toISOString(),
    description: `Recompensa conquistada: ${module.name}`
  });
  if (!commitDemoState(nextState)) {
    renderRewards("Não foi possível salvar o progresso neste navegador.", "is-warning");
    return;
  }
  renderLearning();
  renderRewards(`${currency.format(module.rewardCents / 100)} liberados para resgate. Parabéns por concluir o módulo!`);
  renderGuardianDashboard();
}

function redeemAvailable() {
  const balances = getAccountBalances();
  if (balances.availableCents === 0) {
    renderRewards("Não há valor disponível para resgate.", "is-warning");
    return;
  }

  const redeemedCents = balances.availableCents;
  const nextState = cloneDemoState(demoState);
  nextState.movements.push({
    id: `redemption-${Date.now()}-${nextState.movements.length}`,
    type: "redemption",
    amountCents: redeemedCents,
    date: new Date().toISOString(),
    description: "Resgate demonstrativo do saldo disponível"
  });
  if (!commitDemoState(nextState)) {
    renderRewards("Não foi possível salvar o resgate neste navegador.", "is-warning");
    return;
  }
  renderRewards(`Solicitação demonstrativa concluída: ${currency.format(redeemedCents / 100)} marcados como resgatados. Nenhum pagamento real foi realizado.`, "is-success");
  renderGuardianDashboard();
}

function resetDemo() {
  const initialState = createInitialDemoState();
  if (!commitDemoState(initialState)) {
    renderRewards("Não foi possível reiniciar a demonstração neste navegador.", "is-warning");
    return;
  }
  renderLearning();
  renderRewards("Demonstração reiniciada. Todos os valores voltaram ao início.", "is-success");
  renderGuardianDashboard();
}

function toggleView() {
  const showGuardian = document.querySelector("#guardian-view").hidden;
  document.querySelector("#student-view").hidden = showGuardian;
  document.querySelector("#guardian-view").hidden = !showGuardian;
  document.querySelector("#view-switch").textContent = showGuardian ? "Voltar para visão do aluno" : "Visão dos responsáveis";
  document.querySelector("#view-switch").setAttribute("aria-expanded", String(showGuardian));
  document.querySelector(".context-label").textContent = showGuardian ? "VISÃO DO RESPONSÁVEL" : "ESPAÇO DO ALUNO";
  if (showGuardian) {
    renderGuardianDashboard();
  }
}

document.querySelector("#learning-content").addEventListener("click", (event) => {
  const button = event.target.closest("[data-complete-module]");
  if (button) {
    completeModule(button.dataset.completeModule);
  }
});

document.querySelector("#reward-content").addEventListener("click", (event) => {
  const button = event.target.closest(".redeem-button");
  if (button && !button.disabled) {
    redeemAvailable();
  }
});

document.querySelector("#reset-demo").addEventListener("click", resetDemo);
document.querySelector("#view-switch").addEventListener("click", toggleView);

document.querySelector("#deposit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = document.querySelector("#deposit-amount").valueAsNumber;
  const amountCents = Math.round(amount * 100);
  if (!Number.isFinite(amount) || amountCents <= 0) {
    setGuardianFeedback("Informe um valor positivo para o depósito.", "is-warning");
    return;
  }
  openOperationConfirmation("deposit", amountCents);
});

document.querySelector("#withdrawal-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = document.querySelector("#withdrawal-amount").valueAsNumber;
  const amountCents = Math.round(amount * 100);
  const freeCents = getAccountBalances().freeCents;
  if (!Number.isFinite(amount) || amountCents <= 0) {
    setGuardianFeedback("Informe um valor positivo para a retirada.", "is-warning");
    return;
  }
  if (amountCents > freeCents) {
    setGuardianFeedback("O valor excede o saldo livre disponível para retirada.", "is-warning");
    return;
  }
  openOperationConfirmation("withdrawal", amountCents);
});

document.querySelector("#operation-dialog-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const operation = pendingFinancialOperation;
  pendingFinancialOperation = null;
  document.querySelector("#operation-dialog").close();
  if (operation !== null) {
    const saved = operation.type === "deposit"
      ? applyDeposit(operation.amountCents)
      : applyWithdrawal(operation.amountCents);
    if (saved) {
      document.querySelector(`#${operation.type}-form`).reset();
    }
  }
});

document.querySelector("#operation-cancel").addEventListener("click", () => {
  pendingFinancialOperation = null;
  document.querySelector("#operation-dialog").close();
  setGuardianFeedback("Operação cancelada. Nenhum saldo foi alterado.");
});

document.querySelector("#operation-dialog").addEventListener("cancel", () => {
  pendingFinancialOperation = null;
});

demoState = loadDemoState();
assertAccountInvariants();
renderLearning();
renderRewards();
renderGuardianDashboard();