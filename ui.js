import { tailors, entries, selectedTailorId } from "./state.js";

// ----- RENDER TAILOR LIST (data-driven, like renderHistory) -----

export function renderTailorList() {
  const ul = document.getElementById("tailor-list-ul");
  ul.innerHTML = "";

  tailors.forEach(function (tailor) {
    const li = document.createElement("li");
    const activeClass = tailor.id === selectedTailorId ? " active" : "";
    li.innerHTML = `
      <button class="tailor-chip${activeClass}" data-tailor-id="${tailor.id}">
        <span class="avatar">${tailor.initials}</span>
        <span class="name">${tailor.name}</span>
      </button>
    `;
    ul.appendChild(li);
  });

  const addLi = document.createElement("li");
  addLi.innerHTML = `
    <button class="tailor-chip add-new" id="add-tailor-btn">
      <i class="ti ti-plus"></i>
      <span class="name">Add Tailor</span>
    </button>
  `;
  ul.appendChild(addLi);
}

// ---- RENDER HISTORY LIST -----

export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function renderHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  const categoryFilter = document.getElementById("filter-category").value;
  const searchText = document
    .getElementById("filter-search")
    .value.toLowerCase();

  const tailorEntries = entries.filter(function (entry) {
    const matchesTailor = entry.tailorId === selectedTailorId;
    const matchesCategory =
      categoryFilter === "all" || entry.category === categoryFilter;

    const dateText = formatDate(entry.date).toLowerCase();
    const matchesSearch =
      entry.category.toLowerCase().includes(searchText) ||
      String(entry.pieces).includes(searchText) ||
      dateText.includes(searchText);

    return matchesTailor && matchesCategory && matchesSearch;
  });

  tailorEntries.forEach(function (entry) {
    const amount = entry.pieces * entry.rate;

    const li = document.createElement("li");
    li.className = "history-item";
    li.setAttribute("data-entry-id", entry.id);

    li.innerHTML = `
        <div class="entry-info">
        <p class="entry-desc">${entry.category} · ${entry.pieces} pieces</p>
        <p class="entry-date">${formatDate(entry.date)}</p>
      </div>
      <div class="entry-right">
        <span class="entry-amount">Rs ${amount}</span>
        <div class="entry-actions">
          <button class="icon-btn edit-btn" aria-label="Edit entry">
            <i class="ti ti-edit"></i>
          </button>
          <button class="icon-btn delete-btn" aria-label="Delete entry">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      </div>
    `;
    historyList.appendChild(li);
  });
}

// ----- UPDATE SUMMARY CARD -----

export function updateSummary() {
  const tailor = tailors.find(function (t) {
    return t.id === selectedTailorId;
  });
  if (!tailor) return;

  document.getElementById("selected-tailor-name").textContent = tailor.name;
  document.querySelector(".avatar.large").textContent = tailor.initials;

  const tailorEntries = entries.filter(function (entry) {
    return entry.tailorId === selectedTailorId;
  });

  const totalPieces = tailorEntries.reduce(function (sum, entry) {
    return sum + entry.pieces;
  }, 0);

  const totalEarnings = tailorEntries.reduce(function (sum, entry) {
    return sum + entry.pieces * entry.rate;
  }, 0);

  document.getElementById("stat-pieces").textContent = totalPieces;
  document.getElementById("stat-earnings").textContent =
    "Rs " + totalEarnings.toLocaleString();
}

// ----- UNDO DELETE -----

export function showUndo() {
  document.getElementById("undo-msg").style.display = "block";

  setTimeout(function () {
    document.getElementById("undo-msg").style.display = "none";
  }, 5000);
}

export function hideUndo() {
  document.getElementById("undo-msg").style.display = "none";
}
