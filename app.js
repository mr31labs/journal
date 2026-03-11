/* ============================================================
   Journal App — app.js
   ============================================================ */

(() => {
  'use strict';

  // ── DOM references ──
  const $ = (sel) => document.querySelector(sel);
  const editor       = $('#editor');
  const titleInput   = $('#title-input');
  const entryList    = $('#entry-list');
  const emptyState   = $('#empty-state');
  const toast        = $('#toast');
  const sidebar      = $('#sidebar');
  const hamburger    = $('#hamburger');
  const btnTheme     = $('#btn-theme');

  // Buttons
  const btnNew       = $('#btn-new');
  const btnSort      = $('#btn-sort');
  const btnSaveFile  = $('#btn-save-file');
  const btnLoadFile  = $('#btn-load-file');
  const btnAI        = $('#btn-ai');
  const btnSave      = $('#btn-toolbar-save');
  const btnDelete    = $('#btn-toolbar-delete');
  const btnLink      = $('#btn-link');
  const fileInput    = $('#file-input');

  // Link modal
  const linkModal    = $('#link-modal');
  const linkUrl      = $('#link-url');
  const linkText     = $('#link-text');
  const linkInsert   = $('#link-insert');
  const linkCancel   = $('#link-cancel');

  // AI modal
  const aiModal      = $('#ai-modal');
  const aiKey        = $('#ai-key');
  const aiEndpoint   = $('#ai-endpoint');
  const aiModel      = $('#ai-model');
  const aiAnalyze    = $('#ai-analyze');
  const aiCancel     = $('#ai-cancel');
  const aiResults    = $('#ai-results');

  // ── State ──
  let entries    = [];           // Array of entry objects
  let currentId  = null;         // Currently loaded entry id
  let sortAsc    = false;        // false = newest first
  let savedSelection = null;     // For link insertion

  // ── Theme toggle ──
  // Modes: 'auto' (follow system), 'light', 'dark'
  function getStoredTheme() {
    return localStorage.getItem('journal_theme') || 'auto';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    updateThemeButton(theme);
  }

  function updateThemeButton(theme) {
    const icons = { auto: '🌗', light: '☀️', dark: '🌙' };
    const labels = { auto: 'Auto (system)', light: 'Light mode', dark: 'Dark mode' };
    btnTheme.textContent = icons[theme];
    btnTheme.title = labels[theme];
  }

  function cycleTheme() {
    const order = ['auto', 'light', 'dark'];
    const current = getStoredTheme();
    const next = order[(order.indexOf(current) + 1) % order.length];
    localStorage.setItem('journal_theme', next);
    applyTheme(next);
    const labels = { auto: 'Auto (system)', light: 'Light', dark: 'Dark' };
    showToast(`Theme: ${labels[next]}`);
  }

  btnTheme.addEventListener('click', cycleTheme);

  // ── Helpers ──
  function uuid() {
    return 'xxxx-xxxx-4xxx'.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    ) + '-' + Date.now().toString(36);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // ── LocalStorage cache ──
  function saveToLocalStorage() {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem('journal_entries');
      if (raw) entries = JSON.parse(raw);
    } catch { /* ignore */ }
  }

  // ── AI settings persistence ──
  function loadAISettings() {
    aiKey.value      = localStorage.getItem('journal_ai_key') || '';
    aiEndpoint.value = localStorage.getItem('journal_ai_endpoint') || 'https://api.openai.com/v1/chat/completions';
    aiModel.value    = localStorage.getItem('journal_ai_model') || 'gpt-4o-mini';
  }

  function saveAISettings() {
    localStorage.setItem('journal_ai_key', aiKey.value.trim());
    localStorage.setItem('journal_ai_endpoint', aiEndpoint.value.trim());
    localStorage.setItem('journal_ai_model', aiModel.value.trim());
  }

  // ── Render entry list ──
  function renderEntryList() {
    // Remove all entry items (keep empty state)
    entryList.querySelectorAll('.entry-item').forEach(el => el.remove());

    const sorted = [...entries].sort((a, b) => {
      const da = new Date(a.createdAt), db = new Date(b.createdAt);
      return sortAsc ? da - db : db - da;
    });

    if (sorted.length === 0) {
      emptyState.style.display = '';
      return;
    }
    emptyState.style.display = 'none';

    sorted.forEach(entry => {
      const el = document.createElement('div');
      el.className = 'entry-item' + (entry.id === currentId ? ' active' : '');
      el.dataset.id = entry.id;
      el.innerHTML = `
        <div class="entry-item-title">${escapeHtml(entry.title || 'Untitled')}</div>
        <div class="entry-item-date">${formatDate(entry.createdAt)}</div>
      `;
      el.addEventListener('click', () => loadEntry(entry.id));
      entryList.appendChild(el);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Entry CRUD ──
  function newEntry() {
    currentId = null;
    titleInput.value = '';
    editor.innerHTML = '';
    renderEntryList();
    titleInput.focus();
  }

  function loadEntry(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    currentId = id;
    titleInput.value = entry.title || '';
    editor.innerHTML = entry.content || '';
    renderEntryList();
    // Close sidebar on mobile
    sidebar.classList.remove('open');
  }

  function saveEntry() {
    const title   = titleInput.value.trim();
    const content = editor.innerHTML.trim();

    if (!content && !title) {
      showToast('Nothing to save');
      return;
    }

    if (currentId) {
      // Update existing
      const entry = entries.find(e => e.id === currentId);
      if (entry) {
        entry.title     = title;
        entry.content   = content;
        entry.updatedAt = new Date().toISOString();
      }
    } else {
      // Create new
      const entry = {
        id:        uuid(),
        title:     title || 'Untitled',
        content:   content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      entries.push(entry);
      currentId = entry.id;
    }

    saveToLocalStorage();
    renderEntryList();
    showToast('Entry saved ✓');
  }

  function deleteEntry() {
    if (!currentId) {
      showToast('No entry to delete');
      return;
    }
    if (!confirm('Delete this entry?')) return;
    entries = entries.filter(e => e.id !== currentId);
    saveToLocalStorage();
    newEntry();
    showToast('Entry deleted');
  }

  // ── File save / load (JSON download + file picker) ──
  function saveToFile() {
    // First persist current editor state if there's an active entry
    const title   = titleInput.value.trim();
    const content = editor.innerHTML.trim();
    if (currentId) {
      const entry = entries.find(e => e.id === currentId);
      if (entry) {
        entry.title     = title;
        entry.content   = content;
        entry.updatedAt = new Date().toISOString();
      }
    } else if (title || content) {
      // Auto-create entry before saving to file
      saveEntry();
    }

    const data = JSON.stringify({ entries }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'journal.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('journal.json downloaded');
  }

  function loadFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data.entries)) {
          // Merge: entries from file override existing by id
          const map = new Map(entries.map(en => [en.id, en]));
          data.entries.forEach(en => map.set(en.id, en));
          entries = [...map.values()];
          saveToLocalStorage();
          renderEntryList();
          newEntry();
          showToast(`Loaded ${data.entries.length} entries`);
        } else {
          showToast('Invalid journal file');
        }
      } catch {
        showToast('Could not parse file');
      }
    };
    reader.readAsText(file);
  }

  // ── Toolbar commands ──
  function execCmd(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
  }

  document.querySelectorAll('.toolbar button[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      execCmd(btn.dataset.cmd);
    });
  });

  // ── Link modal ──
  function openLinkModal() {
    // Save selection so we can restore it after modal closes
    const sel = window.getSelection();
    if (sel.rangeCount) {
      savedSelection = sel.getRangeAt(0).cloneRange();
      linkText.value = sel.toString();
    } else {
      savedSelection = null;
      linkText.value = '';
    }
    linkUrl.value = '';
    linkModal.classList.add('open');
    linkUrl.focus();
  }

  function closeLinkModal() {
    linkModal.classList.remove('open');
    editor.focus();
  }

  function insertLink() {
    const url  = linkUrl.value.trim();
    if (!url) { closeLinkModal(); return; }

    const text = linkText.value.trim() || url;

    // Restore selection
    if (savedSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }

    // If there's selected text, wrap it; otherwise insert new
    const sel = window.getSelection();
    if (sel.toString().length > 0) {
      execCmd('createLink', url);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.textContent = text;
      a.target = '_blank';
      a.rel = 'noopener';

      if (sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.insertNode(a);
        range.setStartAfter(a);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    closeLinkModal();
  }

  btnLink.addEventListener('click', openLinkModal);
  linkCancel.addEventListener('click', closeLinkModal);
  linkInsert.addEventListener('click', insertLink);
  linkUrl.addEventListener('keydown', (e) => { if (e.key === 'Enter') insertLink(); });

  // ── AI Analysis ──
  function openAIModal() {
    loadAISettings();
    aiResults.style.display = 'none';
    aiResults.innerHTML = '';
    aiModal.classList.add('open');
    if (!aiKey.value) aiKey.focus();
  }

  function closeAIModal() {
    aiModal.classList.remove('open');
  }

  async function runAIAnalysis() {
    saveAISettings();

    const key      = aiKey.value.trim();
    const endpoint = aiEndpoint.value.trim() || 'https://api.openai.com/v1/chat/completions';
    const model    = aiModel.value.trim() || 'gpt-4o-mini';

    if (!key) { showToast('Please enter an API key'); return; }
    if (entries.length === 0) { showToast('No entries to analyze'); return; }

    // Build the journal text
    const journalText = entries
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(e => {
        const d = formatDate(e.createdAt);
        const plainText = stripHtml(e.content);
        return `--- ${e.title || 'Untitled'} (${d}) ---\n${plainText}`;
      })
      .join('\n\n');

    const systemPrompt = `You are a compassionate and insightful wellness assistant. The user will share their personal journal entries. Analyze all entries holistically and respond with:

1. **Overall Mood Summary** — Describe the general emotional tone across all entries.
2. **Mood Trend** — Note if the mood seems to be improving, declining, or staying stable over time.
3. **Recurring Themes** — List any patterns, topics, or concerns that come up repeatedly.
4. **Mental Health Observations** — Gently highlight anything that might be worth paying attention to for mental and emotional wellbeing (e.g. signs of stress, isolation, anxiety, burnout, or on the positive side: growth, gratitude, resilience).
5. **Suggestions** — Provide 2-3 gentle, actionable suggestions that could support the user's wellbeing.

Be warm, non-judgmental, and supportive. Do NOT diagnose. Format your response with clear sections using markdown headers (###).`;

    // Show loading
    aiResults.style.display = '';
    aiResults.innerHTML = '<div class="ai-loading"><div class="spinner"></div><br>Analyzing your journal…</div>';

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: `Here are my journal entries:\n\n${journalText}` }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`API error ${resp.status}: ${err}`);
      }

      const data = await resp.json();
      const reply = data.choices?.[0]?.message?.content || 'No response received.';

      // Simple markdown-to-html (headers + bold + line breaks)
      aiResults.innerHTML = renderMarkdown(reply);

    } catch (err) {
      aiResults.innerHTML = `<div style="color:var(--danger)">Error: ${escapeHtml(err.message)}</div>`;
    }
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function renderMarkdown(md) {
    return md
      .replace(/### (.+)/g, '<h3>$1</h3>')
      .replace(/## (.+)/g, '<h3>$1</h3>')
      .replace(/# (.+)/g, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  btnAI.addEventListener('click', openAIModal);
  aiCancel.addEventListener('click', closeAIModal);
  aiAnalyze.addEventListener('click', runAIAnalysis);

  // ── Sort toggle ──
  btnSort.addEventListener('click', () => {
    sortAsc = !sortAsc;
    btnSort.textContent = sortAsc ? '↑ Oldest' : '↓ Newest';
    renderEntryList();
  });

  // ── Button bindings ──
  btnNew.addEventListener('click', newEntry);
  btnSave.addEventListener('click', saveEntry);
  btnDelete.addEventListener('click', deleteEntry);
  btnSaveFile.addEventListener('click', saveToFile);
  btnLoadFile.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) loadFromFile(e.target.files[0]);
    fileInput.value = '';
  });

  // ── Hamburger ──
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== hamburger) {
      sidebar.classList.remove('open');
    }
  });

  // ── Close modals on overlay click ──
  [linkModal, aiModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveEntry();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openLinkModal();
    }
    if (e.key === 'Escape') {
      linkModal.classList.remove('open');
      aiModal.classList.remove('open');
    }
  });

  // ── Drag and drop journal.json ──
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.name.endsWith('.json')) {
      loadFromFile(file);
    }
  });

  // ── Paste: strip formatting from external paste into editor ──
  editor.addEventListener('paste', (e) => {
    // Allow HTML paste so we keep internal formatting
    // but we could add a "paste as plain text" option later
  });

  // ── Init ──
  applyTheme(getStoredTheme());
  loadFromLocalStorage();
  renderEntryList();

  // If there are entries, load the most recent one
  if (entries.length > 0) {
    const newest = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    loadEntry(newest.id);
  }

})();
