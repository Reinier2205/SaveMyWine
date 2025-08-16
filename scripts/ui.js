// UI components and interactions for SaveMyWines
// Common UI patterns used across the application

/**
 * Create a loading spinner
 * @param {string} size - Size of spinner (small, medium, large)
 * @returns {HTMLElement} Spinner element
 */
function createSpinner(size = 'medium') {
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner-${size}`;
    
    const sizes = {
        small: '16px',
        medium: '24px',
        large: '32px'
    };
    
    spinner.style.cssText = `
        width: ${sizes[size] || sizes.medium};
        height: ${sizes[size] || sizes.medium};
        border: 2px solid var(--color-secondary);
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
    `;
    
    return spinner;
}

/**
 * Show loading state on a button
 * @param {HTMLElement} button - Button element
 * @param {string} loadingText - Text to show while loading
 */
function showButtonLoading(button, loadingText = 'Loading...') {
    const originalText = button.textContent;
    const spinner = createSpinner('small');
    
    button.disabled = true;
    button.innerHTML = '';
    button.appendChild(spinner);
    button.appendChild(document.createTextNode(' ' + loadingText));
    
    // Store original state for restoration
    button.dataset.originalText = originalText;
    button.dataset.loading = 'true';
}

/**
 * Hide loading state on a button
 * @param {HTMLElement} button - Button element
 */
function hideButtonLoading(button) {
    if (button.dataset.loading === 'true') {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        delete button.dataset.loading;
        delete button.dataset.originalText;
    }
}

/**
 * Create a confirmation dialog
 * @param {string} message - Confirmation message
 * @param {string} title - Dialog title
 * @param {Function} onConfirm - Callback for confirmation
 * @param {Function} onCancel - Callback for cancellation
 */
function showConfirmDialog(message, title = 'Confirm', onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div class="dialog-overlay">
            <div class="dialog-content card">
                <div class="dialog-header">
                    <h3>${title}</h3>
                </div>
                <div class="dialog-body">
                    <p>${message}</p>
                </div>
                <div class="dialog-footer">
                    <button class="button confirm-btn">Confirm</button>
                    <button class="button button-secondary cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add event listeners
    const confirmBtn = dialog.querySelector('.confirm-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    const overlay = dialog.querySelector('.dialog-overlay');
    
    confirmBtn.addEventListener('click', () => {
        dialog.remove();
        if (onConfirm) onConfirm();
    });
    
    cancelBtn.addEventListener('click', () => {
        dialog.remove();
        if (onCancel) onCancel();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            dialog.remove();
            if (onCancel) onCancel();
        }
    });
}

/**
 * Create a modal dialog
 * @param {string} title - Modal title
 * @param {string|HTMLElement} content - Modal content
 * @param {Array} buttons - Array of button configurations
 * @returns {HTMLElement} Modal element
 */
function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'ui-modal';
    
    const buttonHtml = buttons.map(btn => {
        const classes = `button ${btn.class || ''}`;
        return `<button class="${classes}" data-action="${btn.action}">${btn.text}</button>`;
    }).join('');
    
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content card">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${typeof content === 'string' ? content : content.outerHTML}
                </div>
                ${buttons.length > 0 ? `<div class="modal-footer">${buttonHtml}</div>` : ''}
            </div>
        </div>
    `;
    
    return modal;
}

/**
 * Show a modal dialog
 * @param {string} title - Modal title
 * @param {string|HTMLElement} content - Modal content
 * @param {Array} buttons - Array of button configurations
 * @param {Object} options - Modal options
 * @returns {Promise} Promise that resolves with the button action
 */
function showModal(title, content, buttons = [], options = {}) {
    return new Promise((resolve) => {
        const modal = createModal(title, content, buttons);
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Handle button clicks
        buttons.forEach(btn => {
            const button = modal.querySelector(`[data-action="${btn.action}"]`);
            if (button) {
                button.addEventListener('click', () => {
                    modal.remove();
                    resolve(btn.action);
                });
            }
        });
        
        // Handle close button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.remove();
                resolve('close');
            });
        }
        
        // Handle overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && options.closeOnOverlay !== false) {
                modal.remove();
                resolve('close');
            }
        });
        
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', handleEscape);
                modal.remove();
                resolve('close');
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Auto-close after timeout if specified
        if (options.timeout) {
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                    resolve('timeout');
                }
            }, options.timeout);
        }
    });
}

/**
 * Create a tooltip element
 * @param {string} text - Tooltip text
 * @param {string} position - Tooltip position (top, bottom, left, right)
 * @returns {HTMLElement} Tooltip element
 */
function createTooltip(text, position = 'top') {
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.textContent = text;
    
    tooltip.style.cssText = `
        position: absolute;
        background: var(--color-primary);
        color: white;
        padding: 8px 12px;
        border-radius: var(--radius-btn);
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        box-shadow: var(--shadow-1);
    `;
    
    return tooltip;
}

/**
 * Show tooltip on element hover
 * @param {HTMLElement} element - Element to attach tooltip to
 * @param {string} text - Tooltip text
 * @param {string} position - Tooltip position
 */
function addTooltip(element, text, position = 'top') {
    let tooltip = null;
    let timeout = null;
    
    element.addEventListener('mouseenter', () => {
        timeout = setTimeout(() => {
            tooltip = createTooltip(text, position);
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let left, top;
            switch (position) {
                case 'top':
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    top = rect.top - tooltipRect.height - 8;
                    break;
                case 'bottom':
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    top = rect.bottom + 8;
                    break;
                case 'left':
                    left = rect.left - tooltipRect.width - 8;
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    break;
                case 'right':
                    left = rect.right + 8;
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    break;
            }
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            
            // Show tooltip
            setTimeout(() => {
                if (tooltip) tooltip.style.opacity = '1';
            }, 10);
        }, 500); // Delay before showing tooltip
    });
    
    element.addEventListener('mouseleave', () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    });
}

/**
 * Create a progress bar
 * @param {number} value - Current progress value (0-100)
 * @param {string} color - Progress bar color
 * @returns {HTMLElement} Progress bar element
 */
function createProgressBar(value = 0, color = 'var(--color-primary)') {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    progressBar.style.cssText = `
        width: 100%;
        height: 8px;
        background: var(--color-secondary);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    `;
    
    const progress = document.createElement('div');
    progress.className = 'progress-fill';
    progress.style.cssText = `
        height: 100%;
        background: ${color};
        width: ${Math.min(100, Math.max(0, value))}%;
        transition: width 0.3s ease;
        border-radius: 4px;
    `;
    
    progressBar.appendChild(progress);
    
    return progressBar;
}

/**
 * Update progress bar value
 * @param {HTMLElement} progressBar - Progress bar element
 * @param {number} value - New progress value (0-100)
 */
function updateProgressBar(progressBar, value) {
    const progressFill = progressBar.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(100, Math.max(0, value))}%`;
    }
}

/**
 * Create a collapsible section
 * @param {string} title - Section title
 * @param {string|HTMLElement} content - Section content
 * @param {boolean} expanded - Whether section is expanded by default
 * @returns {HTMLElement} Collapsible section element
 */
function createCollapsibleSection(title, content, expanded = false) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
        <h4>${title}</h4>
        <span class="collapsible-icon">${expanded ? '−' : '+'}</span>
    `;
    
    const body = document.createElement('div');
    body.className = 'collapsible-body';
    body.style.display = expanded ? 'block' : 'none';
    
    if (typeof content === 'string') {
        body.innerHTML = content;
    } else {
        body.appendChild(content);
    }
    
    section.appendChild(header);
    section.appendChild(body);
    
    // Add click handler
    header.addEventListener('click', () => {
        const isExpanded = body.style.display !== 'none';
        body.style.display = isExpanded ? 'none' : 'block';
        header.querySelector('.collapsible-icon').textContent = isExpanded ? '+' : '−';
    });
    
    return section;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .confirm-dialog,
    .ui-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }
    
    .dialog-overlay,
    .modal-overlay {
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .dialog-content,
    .modal-content {
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .dialog-header,
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--color-text);
    }
    
    .dialog-footer,
    .modal-footer {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    
    .collapsible-section {
        border: 1px solid #e5e5e5;
        border-radius: var(--radius-card);
        margin-bottom: 15px;
    }
    
    .collapsible-header {
        padding: 15px;
        background: var(--color-bg);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: var(--radius-card) var(--radius-card) 0 0;
    }
    
    .collapsible-header:hover {
        background: var(--color-secondary);
    }
    
    .collapsible-header h4 {
        margin: 0;
        color: var(--color-primary);
    }
    
    .collapsible-icon {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--color-primary);
    }
    
    .collapsible-body {
        padding: 15px;
        border-top: 1px solid #e5e5e5;
    }
`;

document.head.appendChild(style);

// Export functions for use in other modules
window.SaveMyWines = window.SaveMyWines || {};
window.SaveMyWines.ui = {
    createSpinner,
    showButtonLoading,
    hideButtonLoading,
    showConfirmDialog,
    showModal,
    createModal,
    addTooltip,
    createProgressBar,
    updateProgressBar,
    createCollapsibleSection
};
