import {
  tailors,
  entries,
  selectedTailorId,
  loadData,
  addTailor,
  deleteTailor,
  addEntry,
  deleteEntry,
  restoreEntry,
  updateTailorName,
  setSelectedTailorId,
  lastDeletedEntry,
  setLastDeletedEntry,
  currentEditingId,
  setEditingId,
  updateEntry,
} from "./state.js";
import {
  renderTailorList,
  renderHistory,
  updateSummary,
  showUndo,
  hideUndo,
} from "./ui.js";

loadData();
renderTailorList();
renderHistory();
updateSummary();

// ----- FORM SUBMIT -----

const entryForm = document.getElementById("entry-form");
const submitBtn = document.querySelector("#entry-form button[type='submit']");

entryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const category = document.getElementById("entry-category").value;
  const pieces = Number(document.getElementById("entry-pieces").value);
  const rate = Number(document.getElementById("entry-rate").value);

  if (currentEditingId) {
    
    updateEntry(currentEditingId, { category, pieces, rate });
    setEditingId(null); 
    submitBtn.textContent = "+ Add entry"; 
  } else {

    addEntry({ category, pieces, rate });
  }

  renderHistory();
  updateSummary();
  entryForm.reset();
});

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
    setSelectedTailorId(clickedId);

    renderTailorList();
    updateSummary();
    renderHistory();
  }

  if (addBtn) {
    const name = prompt("Enter new tailor's name:");
    if (!name || name.trim() === "") return;

    addTailor(name);

    renderTailorList();
    updateSummary();
    renderHistory();
  }
});

// ----- RENAME TAILOR -----

document
  .getElementById("rename-tailor-btn")
  .addEventListener("click", function () {
    const tailor = tailors.find(function (t) {
      return t.id === selectedTailorId;
    });
    if (!tailor) return;

    const newName = prompt("Enter new name:", tailor.name);
    if (!newName || newName.trim() === "") return;

    updateTailorName(selectedTailorId, newName);
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

    deleteTailor(selectedTailorId);

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

    const deletedEntry = deleteEntry(entryId);

    if (deletedEntry) {
      setLastDeletedEntry(deletedEntry);
      renderHistory();
      updateSummary();
      showUndo();
    }
  }

  if (editBtn) {
    const li = editBtn.closest(".history-item");
    const entryId = Number(li.getAttribute("data-entry-id"));

    const entry = entries.find(function (en) {
      return en.id === entryId;
    });
    if (!entry) return;

    document.getElementById("entry-category").value = entry.category;
    document.getElementById("entry-pieces").value = entry.pieces;
    document.getElementById("entry-rate").value = entry.rate;

    setEditingId(entryId);

    document.querySelector("#entry-form button[type='submit']").textContent = "Update Entry";
  }
});

// ----- UNDO DELETE -----

document.getElementById("undo-btn").addEventListener("click", function () {
  if (!lastDeletedEntry) return;
  restoreEntry(lastDeletedEntry);
  renderHistory();
  updateSummary();
  hideUndo();
  setLastDeletedEntry(null);
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
