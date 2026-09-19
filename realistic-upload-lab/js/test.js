// test.js

document.addEventListener("DOMContentLoaded", () => {
  // Auth Check
  if (!localStorage.getItem("bl_user")) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("bl_user");
    window.location.href = "index.html";
  });

  // Tab Switching
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      document
        .querySelectorAll(".tab-pane")
        .forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document
        .getElementById(t.getAttribute("data-target"))
        .classList.add("active");
    });
  });

  // Icons
  const safeIcon = '<polyline points="20 6 9 17 4 12"></polyline>';
  const dangerIcon =
    '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  // --- TEXT VALIDATION ---
  let textHasAlerted = false;
  const textInput = document.getElementById("text-input");
  textInput.addEventListener("input", (e) => {
    const text = e.target.value;
    const count = text.length; // Characters
    const limit = 8;

    document.getElementById("text-counter").innerText =
      `${count} / 8 characters`;

    const panel = document.getElementById("text-status");
    const icon = document.getElementById("text-icon");
    const heading = document.getElementById("text-status-heading");
    const desc = document.getElementById("text-status-desc");
    const details = document.getElementById("text-status-details");

    if (count === 0) {
      panel.style.display = "none";
      textHasAlerted = false;
      return;
    }

    panel.style.display = "block";

    if (count <= limit) {
      textHasAlerted = false;
      panel.className = "status-panel safe";
      icon.innerHTML = safeIcon;
      heading.innerText = "Input Accepted";
      desc.innerText = "Text is within the allowed size.";
      details.style.display = "none";
    } else {
      panel.className = "status-panel danger";
      icon.innerHTML = dangerIcon;
      heading.innerText = "✕ Segmentation Fault";
      desc.innerText =
        "The submitted input exceeded the allowed memory boundary.";

      details.style.display = "grid";
      details.innerHTML = `
                <div><strong>Maximum allowed:</strong><br>8 characters</div>
                <div><strong>Received:</strong><br>${count} characters</div>
                <div><strong>Excess:</strong><br>${count - limit} characters</div>
                <div><strong>Status:</strong><br>BUFFER OVERFLOW</div>
            `;

      if (!textHasAlerted) {
        textHasAlerted = true;
        setTimeout(() => {
          alert(
            "SEGMENTATION FAULT\n\n" +
              "BUFFER OVERFLOW DETECTED\n\n" +
              "Maximum allowed size: 8 characters\n" +
              "Input size: " +
              count +
              " characters\n\n" +
              "Memory boundary exceeded.",
          );
        }, 10);
      }
    }
  });

  // --- FILE VALIDATION HELPERS ---
  function handleFileValidation(e, type, limitStr, limitBytes) {
    const file = e.target.files[0];
    if (!file) return;

    const size = file.size;
    const prefix = type.toLowerCase();

    const panel = document.getElementById(`${prefix}-status`);
    const icon = document.getElementById(`${prefix}-icon`);
    const heading = document.getElementById(`${prefix}-status-heading`);
    const desc = document.getElementById(`${prefix}-status-desc`);
    const details = document.getElementById(`${prefix}-status-details`);

    panel.style.display = "block";

    if (size <= limitBytes) {
      panel.className = "status-panel safe";
      icon.innerHTML = safeIcon;
      heading.innerText = `✓ ${type} accepted`;
      desc.innerText = `${type} is within the allowed size.`;
      details.style.display = "none";
    } else {
      panel.className = "status-panel danger";
      icon.innerHTML = dangerIcon;
      heading.innerText = "✕ Segmentation Fault";
      desc.innerText = "File exceeds the allowed memory boundary.";

      const excess = size - limitBytes;

      details.style.display = "grid";
      details.innerHTML = `
                <div><strong>Maximum:</strong><br>${limitStr}</div>
                <div><strong>Received:</strong><br>${formatFileSize(size)}</div>
                <div><strong>Excess:</strong><br>${formatFileSize(excess)}</div>
            `;

      setTimeout(() => {
        alert(
          "SEGMENTATION FAULT\n\n" +
            type.toUpperCase() +
            " BUFFER OVERFLOW\n\n" +
            "Maximum allowed file size: " +
            limitStr +
            "\n" +
            "Uploaded file size: " +
            formatFileSize(size) +
            "\n\n" +
            "Excess data: " +
            formatFileSize(excess) +
            "\n\n" +
            "Memory boundary exceeded.",
        );
      }, 10);
    }
  }

  // Attach File Listeners
  document.getElementById("image-input").addEventListener("change", (e) => {
    handleFileValidation(e, "Image", "1 MB", 1048576);
  });

  document.getElementById("audio-input").addEventListener("change", (e) => {
    handleFileValidation(e, "Audio", "3 MB", 5242880);
  });

  document.getElementById("video-input").addEventListener("change", (e) => {
    handleFileValidation(e, "Video", "6 MB", 10485760);
  });
});
