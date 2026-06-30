<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Playground - Algo Infinity Verse</title>

    <!-- Styles -->
    <link rel="stylesheet" href="playground.css">
    <link rel="stylesheet" href="/styles.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- TypeScript Compiler -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/typescript/5.8.2/typescript.min.js"></script>
    
    <!-- Ace Editor -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.0/ace.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.0/ext-language_tools.js"></script>
    
    <!-- Ace Themes -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.0/theme/ambiance.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.0/theme/eclipse.css" />

    <!-- Theme Initialization Script -->
    <script>
      (function() {
        try {
          var storedTheme = localStorage.getItem('theme');
          var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
          var theme = storedTheme || (prefersLight ? 'light' : 'dark');
          if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
          } else {
            document.documentElement.classList.remove('light-mode');
          }
        } catch (e) {}
      })();
    </script>

    <style>
        /* Save Indicator Styles */
        .save-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            transition: all 0.3s ease;
            opacity: 0;
            transform: scale(0.9);
            pointer-events: none;
            margin-left: 12px;
        }

        .save-indicator.idle {
            opacity: 0;
            transform: scale(0.9);
        }

        .save-indicator.saving {
            opacity: 1;
            transform: scale(1);
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid rgba(251, 191, 36, 0.2);
        }

        .save-indicator.saved {
            opacity: 1;
            transform: scale(1);
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.2);
            animation: savePop 0.3s ease;
        }

        .save-indicator.error {
            opacity: 1;
            transform: scale(1);
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .save-indicator.manual-save {
            animation: saveFlash 0.6s ease;
        }

        .save-indicator i {
            font-size: 0.9rem;
        }

        .save-indicator .save-text {
            font-size: 0.75rem;
            font-weight: 600;
        }

        @keyframes savePop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes saveFlash {
            0% { background: rgba(34, 197, 94, 0.3); }
            50% { background: rgba(34, 197, 94, 0.6); }
            100% { background: rgba(34, 197, 94, 0.1); }
        }

        .toolbar-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Dark Theme Save Indicator */
        .dark .save-indicator.saving {
            background: rgba(251, 191, 36, 0.15);
        }

        .dark .save-indicator.saved {
            background: rgba(34, 197, 94, 0.15);
        }

        .dark .save-indicator.error {
            background: rgba(239, 68, 68, 0.15);
        }

        /* Mobile */
        @media (max-width: 768px) {
            .save-indicator .save-text {
                display: none;
            }
            
            .save-indicator {
                padding: 4px 8px;
                margin-left: 8px;
            }
        }
    </style>
</head>

<body data-page="playground">
    <!-- Navbar -->
    <div id="navbar-placeholder"></div>

    <section class="playground-section">
        <div class="playground-container">

            <!-- Header -->
            <div class="playground-header">
                <div class="header-left">
                    <h1>🚀 Code Playground</h1>
                    <p>Write, Run and Learn instantly</p>
                </div>
                <div class="header-right">
                    <span class="theme-indicator" id="themeIndicator">
                        <i class="fas fa-moon"></i>
                        <span>Dark Mode</span>
                    </span>
                </div>
            </div>

            <!-- Toolbar with Save Indicator -->
            <div class="playground-toolbar">
                <div class="toolbar-left">
                    <select id="language">
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="dart">Dart</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                    
                    <!-- Save Indicator -->
                    <span id="saveIndicator" class="save-indicator idle">
                        <i class="fas fa-check-circle"></i>
                        <span class="save-text">Saved</span>
                    </span>
                </div>
                <div class="toolbar-right">
                    <button id="runBtn" class="btn-run" title="Run Code (Ctrl+Enter)">
                        <i class="fas fa-play"></i>
                        Run
                    </button>
                    <button id="clearBtn" class="btn-clear" title="Clear Output">
                        <i class="fas fa-trash"></i>
                        Clear
                    </button>
                    <button id="resetBtn" class="btn-reset" title="Reset to Default">
                        <i class="fas fa-rotate"></i>
                        Reset
                    </button>
                    <button id="saveBtn" class="btn-save" title="Save Code (Ctrl+S)">
                        <i class="fas fa-save"></i>
                        Save
                    </button>
                </div>
            </div>

            <!-- Editor & Output Grid -->
            <div class="playground-grid">
                <!-- Editor Card -->
                <div class="editor-card">
                    <div class="card-header">
                        <i class="fas fa-file-code"></i>
                        Editor
                        <span class="language-badge" id="languageBadge">JavaScript</span>
                        <span style="margin-left: auto; font-size: 0.7rem; color: var(--text-secondary);">
                            <kbd>Ctrl+S</kbd> to save
                        </span>
                    </div>
                    <div id="editor"></div>
                </div>

                <!-- Output Card -->
                <div class="output-card">
                    <div class="card-header">
                        <i class="fas fa-terminal"></i>
                        Console Output
                        <button id="clearOutputBtn" class="btn-clear-output" title="Clear output">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <pre id="output">▶ Run your code to see output here</pre>
                </div>
            </div>

        </div>
    </section>

    <!-- Footer -->
    <div id="footer-placeholder"></div>

    <!-- Scripts -->
    <script type="module" src="playground.js"></script>
    <script src="/theme.js"></script>
    <script src="/script.js"></script>
    
    <script>
        // Load partials
        if (typeof loadPartial === 'function') {
            loadPartial('navbar-placeholder', '/partials/navbar.html').then(() => {
                if (typeof initNavbar === 'function') initNavbar();
            });
            loadPartial('footer-placeholder', '/partials/footer.html');
        }

        // Manual save button
        document.addEventListener('DOMContentLoaded', function() {
            const saveBtn = document.getElementById('saveBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    // Trigger save via the editor
                    const event = new KeyboardEvent('keydown', {
                        key: 's',
                        ctrlKey: true,
                        bubbles: true
                    });
                    document.dispatchEvent(event);
                });
            }
        });
    </script>
</body>

</html>