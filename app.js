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

const completedModules = new Set();
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});
let rewardBalances = {
  lockedCents: DEPOSIT_CENTS,
  availableCents: 0,
  redeemedCents: 0
};

function getRewardTotal(level) {
  return level.tracks
    .flatMap((track) => track.modules)
    .reduce((total, module) => total + module.rewardCents, 0);
}

function assertBalanceInvariant() {
  const total = rewardBalances.lockedCents + rewardBalances.availableCents + rewardBalances.redeemedCents;
  if (total !== DEPOSIT_CENTS) {
    throw new Error("Os saldos da demonstração não correspondem à mesada depositada.");
  }
}

for (const level of learningLevels) {
  if (getRewardTotal(level) !== DEPOSIT_CENTS) {
    throw new Error(`As recompensas de ${level.name} não correspondem à mesada fictícia.`);
  }
}

function getActiveLevel() {
  return learningLevels.find((level) => level.id === student.levelId);
}

function getActiveModules() {
  return getActiveLevel().tracks.flatMap((track) => track.modules);
}

function renderModule(module, index) {
  const completed = completedModules.has(module.id);
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
  const completedCount = track.modules.filter((module) => completedModules.has(module.id)).length;
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
  document.querySelector(".student-profile").setAttribute("aria-label", `Aluna ${student.name}`);
  document.querySelector("#learning-content").innerHTML = level.tracks.map(renderTrack).join("");
}

function renderRewards(notice = "Conclua módulos para liberar parte da sua mesada fictícia.", noticeType = "") {
  document.querySelector("#reward-content").innerHTML = `
    <div class="balance-grid" aria-label="Saldos da mesada fictícia">
      <div class="balance-card">
        <span class="balance-label">Bloqueado</span>
        <strong class="balance-value">${currency.format(rewardBalances.lockedCents / 100)}</strong>
      </div>
      <div class="balance-card is-available">
        <span class="balance-label">Disponível para resgate</span>
        <strong class="balance-value">${currency.format(rewardBalances.availableCents / 100)}</strong>
      </div>
      <div class="balance-card is-redeemed">
        <span class="balance-label">Resgatado</span>
        <strong class="balance-value">${currency.format(rewardBalances.redeemedCents / 100)}</strong>
      </div>
    </div>
    <p class="deposit-line"><span>Mesada fictícia depositada</span><strong>${currency.format(DEPOSIT_CENTS / 100)}</strong></p>
    <div class="reward-actions">
      <p class="reward-notice${noticeType ? ` ${noticeType}` : ""}" role="status" aria-live="polite">${notice}</p>
      <button class="redeem-button" type="button"${rewardBalances.availableCents === 0 ? " disabled" : ""}>Resgatar valor disponível</button>
    </div>
  `;
}

function completeModule(moduleId) {
  const module = getActiveModules().find((item) => item.id === moduleId);
  if (!module || completedModules.has(moduleId)) {
    return;
  }

  completedModules.add(moduleId);
  rewardBalances.lockedCents -= module.rewardCents;
  rewardBalances.availableCents += module.rewardCents;
  assertBalanceInvariant();
  renderLearning();
  renderRewards(`${currency.format(module.rewardCents / 100)} liberados para resgate. Parabéns por concluir o módulo!`);
}

function redeemAvailable() {
  if (rewardBalances.availableCents === 0) {
    renderRewards("Não há valor disponível para resgate.", "is-warning");
    return;
  }

  const redeemedCents = rewardBalances.availableCents;
  rewardBalances.availableCents = 0;
  rewardBalances.redeemedCents += redeemedCents;
  assertBalanceInvariant();
  renderRewards(`Solicitação demonstrativa concluída: ${currency.format(redeemedCents / 100)} marcados como resgatados. Nenhum pagamento real foi realizado.`, "is-success");
}

function resetDemo() {
  completedModules.clear();
  rewardBalances = {
    lockedCents: DEPOSIT_CENTS,
    availableCents: 0,
    redeemedCents: 0
  };
  renderLearning();
  renderRewards("Demonstração reiniciada. Todos os valores voltaram ao início.", "is-success");
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

renderLearning();
renderRewards();