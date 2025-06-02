const Utils = {
    showToast: (message, type = "success") => {
        let container = document.getElementById("toast-container");

        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `toast ${type} show`;

        const icon = type === "success" ? "✅"
            : type === "error" ? "❌"
                : type === "warning" ? "⚠️"
                    : "ℹ️";

        toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
};
