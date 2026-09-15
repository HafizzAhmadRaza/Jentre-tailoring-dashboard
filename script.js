// ----- DATA -----

let tailors = [
  { id: 1, name: "Sara Ahmed", initials: "SA" },
  { id: 2, name: "Sadaf", initials: "SD" },
  { id: 3, name: "Muqadas", initials: "MQ" },
  { id: 4, name: "Amna", initials: "AM" },
];

let entries = [
  {
    id: 1,
    tailorId: 1,
    category: "shirt",
    pieces: 12,
    rate: 150,
    date: "2026-08-22",
  },
  {
    id: 2,
    tailorId: 1,
    category: "pajama",
    pieces: 8,
    rate: 150,
    date: "2026-08-21",
  },
];

let selectedTailorId = 1;

loadData();

// ----- HELPER: robust unique ID generator -----
// Using array.length + 1 breaks after deletions (can create duplicate IDs).
// This always looks at the highest existing ID and adds 1, so it's safe
// no matter how many items were deleted before.
function getNextId(array) {
  if (array.length === 0) return 1;
  const maxId = array.reduce(function (max, item) {
    return item.id > max ? item.id : max;
  }, 0);
  return maxId + 1;
}

// ----- RENDER TAILOR LIST (data-driven, like renderHistory) -----

function renderTailorList() {
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
renderTailorList();

// ----- FORM SUBMIT -----

const entryForm = document.getElementById("entry-form");

entryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const category = document.getElementById("entry-category").value;
  const pieces = Number(document.getElementById("entry-pieces").value);
  const rate = Number(document.getElementById("entry-rate").value);

  const newEntry = {
    id: getNextId(entries),
    tailorId: selectedTailorId,
    category: category,
    pieces: pieces,
    rate: rate,
    date: new Date().toISOString().split("T")[0],
  };
  entries.push(newEntry);
  saveData();
  renderHistory();
  updateSummary();
});

// ---- RENDER HISTORY LIST -----

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function renderHistory() {
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
renderHistory();

document
  .getElementById("filter-category")
  .addEventListener("change", renderHistory);
document
  .getElementById("filter-search")
  .addEventListener("input", renderHistory);

// ----- TAILOR SWITCH + ADD TAILOR (event delegation) -----

const tailorListEl = document.getElementById("tailor-list-ul");

tailorListEl.addEventListener("click", function (e) {
  const chip = e.target.closest(".tailor-chip:not(.add-new)");
  const addBtn = e.target.closest("#add-tailor-btn");

  if (chip) {
    const clickedId = Number(chip.getAttribute("data-tailor-id"));
    selectedTailorId = clickedId;

    renderTailorList();
    updateSummary();
    renderHistory();
  }

  if (addBtn) {
    const name = prompt("Enter new tailor's name:");
    if (!name || name.trim() === "") return;

    const initials = name.trim().slice(0, 2).toUpperCase();
    const newId = getNextId(tailors);

    const newTailor = { id: newId, name: name.trim(), initials: initials };
    tailors.push(newTailor);
    selectedTailorId = newId;
    saveData();

    renderTailorList();
    updateSummary();
    renderHistory();
  }
});

// ----- UPDATE SUMMARY CARD -----

function updateSummary() {
  const tailor = tailors.find(function (t) {
    return t.id === selectedTailorId;
  });

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
updateSummary();

// ----- RENAME TAILOR -----

document
  .getElementById("rename-tailor-btn")
  .addEventListener("click", function () {
    const tailor = tailors.find(function (t) {
      return t.id === selectedTailorId;
    });

    const newName = prompt("Enter new name:", tailor.name);
    if (!newName || newName.trim() === "") return;

    tailor.name = newName.trim();
    tailor.initials = newName.trim().slice(0, 2).toUpperCase();

    saveData();
    updateSummary();
    renderTailorList();
  });

// ----- DELETE TAILOR -----

document
  .getElementById("delete-tailor-btn")
  .addEventListener("click", function () {
    if (tailors.length <= 1) {
      alert("At least one tailor must remain.");
      return;
    }

    const tailor = tailors.find(function (t) {
      return t.id === selectedTailorId;
    });

    const confirmDelete = confirm(
      "Delete " + tailor.name + " and all their entries?",
    );
    if (!confirmDelete) return;

    tailors = tailors.filter(function (t) {
      return t.id !== selectedTailorId;
    });

    entries = entries.filter(function (e) {
      return e.tailorId !== selectedTailorId;
    });

    selectedTailorId = tailors[0].id;

    saveData();
    renderTailorList();
    updateSummary();
    renderHistory();
  });

// ----- EDIT / DELETE ENTRY (event delegation) -----

document.getElementById("history-list").addEventListener("click", function (e) {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (deleteBtn) {
    const li = deleteBtn.closest(".history-item");
    const entryId = Number(li.getAttribute("data-entry-id"));

    const deletedEntry = entries.find(function (entry) {
      return entry.id === entryId;
    });

    entries = entries.filter(function (entry) {
      return entry.id !== entryId;
    });

    saveData();
    renderHistory();
    updateSummary();
    showUndo(deletedEntry);
  }

  if (editBtn) {
    const li = editBtn.closest(".history-item");
    const entryId = Number(li.getAttribute("data-entry-id"));

    const entry = entries.find(function (en) {
      return en.id === entryId;
    });

    document.getElementById("entry-category").value = entry.category;
    document.getElementById("entry-pieces").value = entry.pieces;
    document.getElementById("entry-rate").value = entry.rate;

    entries = entries.filter(function (en) {
      return en.id !== entryId;
    });

    saveData();
    renderHistory();
    updateSummary();
  }
});

// ----- LOCALSTORAGE: SAVE & LOAD -----

function saveData() {
  localStorage.setItem("jentre-tailors", JSON.stringify(tailors));
  localStorage.setItem("jentre-entries", JSON.stringify(entries));
}

function loadData() {
  const savedTailors = localStorage.getItem("jentre-tailors");
  const savedEntries = localStorage.getItem("jentre-entries");

  if (savedTailors) {
    tailors = JSON.parse(savedTailors);
  }
  if (savedEntries) {
    entries = JSON.parse(savedEntries);
  }
}

// ----- UNDO DELETE -----

let lastDeletedEntry = null;

function showUndo(entry) {
  lastDeletedEntry = entry;
  document.getElementById("undo-msg").style.display = "block";

  setTimeout(function () {
    document.getElementById("undo-msg").style.display = "none";
    lastDeletedEntry = null;
  }, 5000);
}

document.getElementById("undo-btn").addEventListener("click", function () {
  if (!lastDeletedEntry) return;
  entries.push(lastDeletedEntry);
  saveData();
  renderHistory();
  updateSummary();
  document.getElementById("undo-msg").style.display = "none";
  lastDeletedEntry = null;
});

// ----- MONTHLY SUMMARY -----

function showMonthlySummary() {
  const now = new Date();

  const monthEntries = entries.filter(function (entry) {
    const entryDate = new Date(entry.date);
    return (
      entry.tailorId === selectedTailorId &&
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getFullYear() === now.getFullYear()
    );
  });

  const totalPieces = monthEntries.reduce(function (sum, e) {
    return sum + e.pieces;
  }, 0);

  const totalEarnings = monthEntries.reduce(function (sum, e) {
    return sum + e.pieces * e.rate;
  }, 0);

  alert(
    "This month:\nPieces: " +
      totalPieces +
      "\nEarnings: Rs " +
      totalEarnings.toLocaleString(),
  );
}

document
  .getElementById("monthly-summary-btn")
  .addEventListener("click", showMonthlySummary);
