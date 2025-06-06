const logMessages = [
  '[EXEC] Ping sent to satellite...',
  '[WARN] CRC mismatch on port 02',
  '[SYS] Authentication request received',
  '[ERR] Stack overflow in core process',
  '[INFO] Memory check complete',
  '[SYS] Re-routing terminal output...',
  '[WARN] Voltage spike detected',
  '[ERR] Unauthorized command intercepted'
];

const terminal = document.getElementById('terminal');
const alertPanel = document.getElementById('alert-panel');
const clearAlertButton = document.getElementById('clear-alert');
const commandInput = document.getElementById('command-input');
const runButton = document.getElementById('run-button');
const powerToggle = document.getElementById('power-toggle');
const themeButtons = document.querySelectorAll('#theme-controls button');
const toggleSecurity = document.getElementById('toggle-security');
const toggleMonitor = document.getElementById('toggle-monitor');
const securityFeed = document.getElementById('security-feed');
const systemMonitor = document.getElementById('system-monitor');

let powerMode = 'normal';

// Initial log debug
const logs = document.querySelectorAll('.log-entry');
logs[1].textContent = '[INFO] Input received...';
logs[2].classList.add('highlight');

// Clear alert
clearAlertButton.addEventListener('click', () => {
  alertPanel.classList.add('hidden');
});

// Power toggle
powerToggle.addEventListener('click', () => {
  const timestamp = new Date().toLocaleTimeString();

  if (powerMode === 'normal') {
    powerMode = 'low';
    document.body.classList.add('low-power');
    commandInput.disabled = true;
    runButton.disabled = true;

    const log = document.createElement('p');
    log.classList.add('log-entry');
    log.textContent = `[SYS] Power Save Mode ENABLED (${timestamp})`;
    terminal.appendChild(log);
  } else {
    powerMode = 'normal';
    document.body.classList.remove('low-power');
    commandInput.disabled = false;
    runButton.disabled = false;

    const log = document.createElement('p');
    log.classList.add('log-entry');
    log.textContent = `[SYS] Power Save Mode DISABLED (${timestamp})`;
    terminal.appendChild(log);
  }
});

// Run command
runButton.addEventListener('click', () => {
  if (powerMode === 'low') {
    const blocked = document.createElement('p');
    blocked.classList.add('log-entry', 'warn');
    blocked.textContent = `[SYS] Command blocked — Power Save Mode active. (${new Date().toLocaleTimeString()})`;
    terminal.appendChild(blocked);
    return;
  }

  const newLog = document.createElement('p');
  newLog.classList.add('log-entry');

  let message;
  if (commandInput.value.trim()) {
    message = `[USER] ${commandInput.value.trim()}`;
    commandInput.value = '';
  } else {
    message = logMessages[Math.floor(Math.random() * logMessages.length)];
  }

  newLog.textContent = `${message} (${new Date().toLocaleTimeString()})`;

  if (message.startsWith('[ERR]')) {
    newLog.classList.add('err');
    alertPanel.classList.remove('hidden');
  } else if (message.startsWith('[WARN]')) {
    newLog.classList.add('warn');
  }

  terminal.appendChild(newLog);
});

// Theme switching
themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (powerMode === 'low') {
      const blocked = document.createElement('p');
      blocked.classList.add('log-entry', 'warn');
      blocked.textContent = `[SYS] Theme change blocked — Power Save Mode active. (${new Date().toLocaleTimeString()})`;
      terminal.appendChild(blocked);
      return;
    }

    document.body.classList.remove('theme-amber', 'theme-red');
    const newTheme = button.dataset.theme;

    if (newTheme !== 'green') {
      document.body.classList.add(`theme-${newTheme}`);
    }

    const themeLog = document.createElement('p');
    themeLog.classList.add('log-entry');
    themeLog.textContent = `[SYS] Theme switched to ${newTheme.toUpperCase()} (${new Date().toLocaleTimeString()})`;
    terminal.appendChild(themeLog);
  });
});

// Toggle security feed
toggleSecurity.addEventListener('click', () => {
  if (powerMode === 'low') {
    const log = document.createElement('p');
    log.classList.add('log-entry', 'warn');
    log.textContent = `[SYS] Toggle blocked — Power Save Mode active. (${new Date().toLocaleTimeString()})`;
    terminal.appendChild(log);
    return;
  }

  securityFeed.classList.toggle('hidden');
  const state = securityFeed.classList.contains('hidden') ? 'DISABLED' : 'ENABLED';

  const log = document.createElement('p');
  log.classList.add('log-entry');
  log.textContent = `[SYS] Security Feed ${state} (${new Date().toLocaleTimeString()})`;
  terminal.appendChild(log);
});

// Toggle system monitor
toggleMonitor.addEventListener('click', () => {
  if (powerMode === 'low') {
    const log = document.createElement('p');
    log.classList.add('log-entry', 'warn');
    log.textContent = `[SYS] Toggle blocked — Power Save Mode active. (${new Date().toLocaleTimeString()})`;
    terminal.appendChild(log);
    return;
  }

  systemMonitor.classList.toggle('hidden');
  const state = systemMonitor.classList.contains('hidden') ? 'DISABLED' : 'ENABLED';

  const log = document.createElement('p');
  log.classList.add('log-entry');
  log.textContent = `[SYS] System Monitor ${state} (${new Date().toLocaleTimeString()})`;
  terminal.appendChild(log);
});
