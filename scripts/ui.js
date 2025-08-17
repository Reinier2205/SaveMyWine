// UI components and interactions for SaveMyWines
// Common UI patterns used across the application

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
        border: 2px solid #f3f3f3;
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
    `;
    
    // Add CSS animation if not already present
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    return spinner;
}

function showButtonLoading(button, loadingText = 'Loading...') {
    if (button.classList.contains('loading')) return;
    
    button.classList.add('loading');
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    
    // Add spinner
    const spinner = createSpinner('small');
    button.appendChild(spinner);
}

function hideButtonLoading(button) {
    if (!button.classList.contains('loading')) return;
    
    button.classList.remove('loading');
    button.textContent = button.dataset.originalText || 'Button';
    button.disabled = false;
    
    // Remove spinner
    const spinner = button.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
}

function showConfirmDialog(message, title = 'Confirm', onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: var(--color-primary);">${title}</h3>
        <p style="margin: 0 0 24px 0; line-height: 1.5;">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="button button-secondary" id="cancel-btn">Cancel</button>
            <button class="button" id="confirm-btn">Confirm</button>
        </div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Event listeners
    const confirmBtn = dialog.querySelector('#confirm-btn');
    const cancelBtn = dialog.querySelector('#cancel-btn');
    
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.remove();
        if (onCancel) onCancel();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            if (onCancel) onCancel();
        }
    });
    
    return modal;
}

function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: var(--color-primary);">${title}</h3>
        <div class="modal-body">${content}</div>
        ${buttons.length > 0 ? `
            <div class="modal-actions" style="margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end;">
                ${buttons.map(btn => `
                    <button class="button ${btn.class || 'button-secondary'}" id="btn-${btn.id}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    modal.appendChild(modalContent);
    
    // Add button event listeners
    buttons.forEach(btn => {
        if (btn.onClick) {
            const buttonElement = modalContent.querySelector(`#btn-${btn.id}`);
            if (buttonElement) {
                buttonElement.addEventListener('click', () => {
                    btn.onClick(modal);
                });
            }
        }
    });
    
    return modal;
}

function showModal(title, content, buttons = [], options = {}) {
    const modal = createModal(title, content, buttons);
    
    if (options.closeOnOutsideClick !== false) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    document.body.appendChild(modal);
    return modal;
}

function createTooltip(text, position = 'top') {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    const positions = {
        top: 'bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;',
        bottom: 'top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px;',
        left: 'right: 100%; top: 50%; transform: translateY(-50%); margin-right: 8px;',
        right: 'left: 100%; top: 50%; transform: translateY(-50%); margin-left: 8px;'
    };
    
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        ${positions[position] || positions.top}
    `;
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    arrow.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border: 4px solid transparent;
    `;
    
    const arrowPositions = {
        top: 'top: 100%; left: 50%; transform: translateX(-50%); border-top-color: #333;',
        bottom: 'bottom: 100%; left: 50%; transform: translateX(-50%); border-bottom-color: #333;',
        left: 'left: 100%; top: 50%; transform: translateY(-50%); border-left-color: #333;',
        right: 'right: 100%; top: 50%; transform: translateY(-50%); border-right-color: #333;'
    };
    
    arrow.style.cssText += arrowPositions[position] || arrowPositions.top;
    tooltip.appendChild(arrow);
    
    return tooltip;
}

function addTooltip(element, text, position = 'top') {
    const tooltip = createTooltip(text, position);
    
    element.addEventListener('mouseenter', () => {
        element.style.position = 'relative';
        element.appendChild(tooltip);
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 200);
    });
}

function createProgressBar(value = 0, color = 'var(--color-primary)') {
    const container = document.createElement('div');
    container.className = 'progress-container';
    container.style.cssText = `
        width: 100%;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
    `;
    
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.style.cssText = `
        height: 100%;
        background: ${color};
        width: ${Math.min(100, Math.max(0, value))}%;
        transition: width 0.3s ease;
    `;
    
    container.appendChild(bar);
    
    // Add update method
    container.updateProgress = function(newValue) {
        bar.style.width = `${Math.min(100, Math.max(0, newValue))}%`;
    };
    
    return container;
}

function updateProgressBar(progressBar, value) {
    if (progressBar.updateProgress) {
        progressBar.updateProgress(value);
    }
}

function createCollapsibleSection(title, content, expanded = false) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';
    section.style.cssText = `
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        margin-bottom: 16px;
        overflow: hidden;
    `;
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.style.cssText = `
        padding: 16px;
        background: #f9f9f9;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
    `;
    
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.margin = '0';
    
    const icon = document.createElement('span');
    icon.textContent = expanded ? '−' : '+';
    icon.style.cssText = `
        font-size: 20px;
        font-weight: bold;
        color: var(--color-primary);
    `;
    
    header.appendChild(titleElement);
    header.appendChild(icon);
    
    const contentElement = document.createElement('div');
    contentElement.className = 'collapsible-content';
    contentElement.style.cssText = `
        padding: 16px;
        display: ${expanded ? 'block' : 'none'};
    `;
    contentElement.innerHTML = content;
    
    section.appendChild(header);
    section.appendChild(contentElement);
    
    // Toggle functionality
    header.addEventListener('click', () => {
        const isExpanded = contentElement.style.display !== 'none';
        contentElement.style.display = isExpanded ? 'none' : 'block';
        icon.textContent = isExpanded ? '+' : '−';
    });
    
    return section;
}

// Export UI components to global scope
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
