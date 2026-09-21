// ----- DATA -----

export let tailors = [
  { id: 1, name: "Sara Ahmed", initials: "SA" },
  { id: 2, name: "Sadaf", initials: "SD" },
  { id: 3, name: "Muqadas", initials: "MQ" },
  { id: 4, name: "Amna", initials: "AM" },
];

export let entries = [
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

export let selectedTailorId = 1;
export let lastDeletedEntry = null;

export function setSelectedTailorId(id) {
  selectedTailorId = id;
}

export function setLastDeletedEntry(entry) {
  lastDeletedEntry = entry;
}

// ----- HELPER: robust unique ID generator -----
export function getNextId(array) {
  if (array.length === 0) return 1;
  const maxId = array.reduce(function (max, item) {
    return item.id > max ? item.id : max;
  }, 0);
  return maxId + 1;
}

// ----- LOCALSTORAGE: SAVE & LOAD -----

export function saveData() {
  localStorage.setItem("jentre-tailors", JSON.stringify(tailors));
  localStorage.setItem("jentre-entries", JSON.stringify(entries));
}

export function loadData() {
  const savedTailors = localStorage.getItem("jentre-tailors");
  const savedEntries = localStorage.getItem("jentre-entries");

  if (savedTailors) {
    tailors.length = 0;
    tailors.push(...JSON.parse(savedTailors));
  }
  if (savedEntries) {
    entries.length = 0;
    entries.push(...JSON.parse(savedEntries));
  }
}

// ----- STATE MUTATION HELPERS -----

export function addTailor(name) {
  const initials = name.trim().slice(0, 2).toUpperCase();
  const newId = getNextId(tailors);
  const newTailor = { id: newId, name: name.trim(), initials: initials };
  tailors.push(newTailor);
  setSelectedTailorId(newId);
  saveData();
  return newTailor;
}

export function deleteTailor(id) {
  const index = tailors.findIndex(function (t) {
    return t.id === id;
  });
  if (index !== -1) {
    tailors.splice(index, 1);
  }
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].tailorId === id) {
      entries.splice(i, 1);
    }
  }
  if (tailors.length > 0) {
    setSelectedTailorId(tailors[0].id);
  }
  saveData();
}

export function addEntry(entryData) {
  const newEntry = {
    id: getNextId(entries),
    tailorId: selectedTailorId,
    category: entryData.category,
    pieces: entryData.pieces,
    rate: entryData.rate,
    date: new Date().toISOString().split("T")[0],
  };
  entries.push(newEntry);
  saveData();
  return newEntry;
}

export function deleteEntry(entryId) {
  const index = entries.findIndex(function (entry) {
    return entry.id === entryId;
  });
  let deleted = null;
  if (index !== -1) {
    deleted = entries[index];
    entries.splice(index, 1);
    saveData();
  }
  return deleted;
}

export function restoreEntry(entry) {
  if (entry) {
    entries.push(entry);
    saveData();
  }
}

export function updateTailorName(id, newName) {
  const tailor = tailors.find(function (t) {
    return t.id === id;
  });
  if (tailor) {
    tailor.name = newName.trim();
    tailor.initials = newName.trim().slice(0, 2).toUpperCase();
    saveData();
  }
}
